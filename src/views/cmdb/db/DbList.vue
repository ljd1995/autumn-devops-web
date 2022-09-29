DbColumn<template>
  <PageWrapper v-loading="loadingRef">
    <p class="font-bold ml-4 mt-4 -mb-4">数据库列表</p>
    <Divider />
    <div class="-mt-5 pb-5"
      ><Collapse :bordered="false">
        <CollapsePanel class="bg-gray-100 -mb-7 pl-4" v-for="item in dbListdata" :key="item.id"
          ><template #header>
            <p @click="handleConnClick(item)" class="conn">
              <Icon class="w-6" icon="logos:mysql" v-if="item.db_type === 'mysql'" />
              <Icon class="w-6" icon="logos:postgresql" v-else-if="item.db_type === 'pg'" />
              <Icon class="w-6" icon="logos:mariadb" v-else-if="item.db_type === 'maria'" />
              <Icon class="w-6" icon="logos:redis" v-else-if="item.db_type === 'redis'" />
              <Icon class="w-6" icon="logos:mongodb" v-else-if="item.db_type === 'mongo'" />
              <Icon class="w-6" icon="logos:elasticsearch" v-else-if="item.db_type === 'elastic'" />
              <Icon class="w-6" icon="logos:hbase" v-else-if="item.db_type === 'hbase'" />
              {{ item.remark }}
            </p> </template
          ><Collapse :bordered="false">
            <CollapsePanel
              class="bg-gray-100 -mb-5 pl-4 -mt-8"
              v-for="schema in item.dbSchemadata"
              :key="schema.schemaName"
              ><template #header>
                <p @click="handleSchemaClick(item, schema)" class="conn">
                  <Icon class="w-6 mt-1" icon="flat-color-icons:database" />{{
                    schema.schemaName
                  }}</p
                ></template
              >
              <div class="bg-gray-100 ml-10 -mt-2 mb-3"
                ><p
                  class="conn mb-1"
                  v-for="table in schema.dbTabledata"
                  :key="table.tableName"
                  @contextmenu="handleTableContext(item, schema, table, $event)"
                >
                  <Icon class="w-6 mt-1" color="blue" icon="fluent:table-48-filled" />{{
                    table.table_name
                  }}</p
                ></div
              >
            </CollapsePanel>
          </Collapse></CollapsePanel
        >
      </Collapse></div
    >
  </PageWrapper>
</template>
<script lang="ts" setup name="DbList">
  import { Divider, Collapse, CollapsePanel } from 'ant-design-vue';
  import { onMounted, ref } from 'vue';
  import { getColumns, getDbPageList, getSchemaNames, getTableNames } from '/@/api/cmdb/db';
  import { TableItem } from '/@/api/cmdb/model/dbModel';
  import Icon from '/@/components/Icon';
  import { PageWrapper } from '/@/components/Page';
  import { AesEnum } from '/@/enums/cipherEnum';
  import { useContextMenu } from '/@/hooks/web/useContextMenu';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { AesEncryption } from '/@/utils/cipher';

  const loadingRef = ref(false);
  const dbListdata = ref<Recordable[]>([]);

  const { createMessage } = useMessage();
  const [createContextMenu] = useContextMenu();

  const emit = defineEmits(['table', 'design', 'open']);

  const aes = new AesEncryption({ key: AesEnum.KEY, iv: AesEnum.IV });

  async function getDbList() {
    loadingRef.value = true;
    getDbPageList({ page: 1, page_size: 500 })
      .then((data) => {
        dbListdata.value = data.items.map((item) => {
          return {
            ...item,
            admin_password: aes.decryptByAES(item.admin_password),
            query_password: aes.decryptByAES(item.query_password),
          };
        });
        console.log(dbListdata.value);
      })
      .catch((e) => {
        console.log(e);
        createMessage.error(e);
      })
      .finally(() => {
        loadingRef.value = false;
      });
  }

  function handleConnClick(item) {
    let supports = ['pg', 'mysql', 'maria'];
    if (supports.indexOf(item.db_type) != -1) {
      if (!item.dbSchemadata) {
        loadingRef.value = true;
        getSchemaNames({
          username: item.admin_user,
          password: item.admin_password,
          host: item.address,
          port: item.port,
          db_type: item.db_type,
        })
          .then((data) => {
            item['dbSchemadata'] = data.map((i) => {
              return { schemaName: i };
            });
          })
          .catch((e) => {
            console.log(e);
            createMessage.error(
              '获取数据库信息失败，请检查数据库用户名密码是否正确，数据库是否开放连接权限',
            );
          })
          .finally(() => {
            loadingRef.value = false;
          });
      }
    } else {
      createMessage.info(`${item.db_type} 暂未支持在页面操作，请等待后续支持`);
    }
  }

  function handleSchemaClick(item, schema) {
    if (!schema.dbTabledata) {
      loadingRef.value = true;
      getTableNames({
        username: item.admin_user,
        password: item.admin_password,
        host: item.address,
        port: item.port,
        db_type: item.db_type,
        schema_name: schema.schemaName,
      })
        .then((data) => {
          schema['dbTabledata'] = data as unknown[] as TableItem[];
          emit('table', data);
        })
        .catch((e) => {
          console.log(e);
          createMessage.error(
            '获取数据库信息失败，请检查数据库用户名密码是否正确，数据库是否开放连接权限',
          );
        })
        .finally(() => {
          loadingRef.value = false;
        });
    } else {
      emit('table', schema['dbTabledata']);
    }
  }

  function handleTableContext(item, schema, table, e: MouseEvent) {
    createContextMenu({
      event: e,
      items: [
        {
          label: '打开表',
          icon: 'bx:folder-open',
          handler: () => {
            emit('open', {
              item,
              tableName: table.table_name,
              schemaName: schema.schemaName,
              connName: item.remark,
            });
          },
        },
        {
          label: '设计表',
          icon: 'icon-park-outline:bydesign',
          handler: () => {
            getColumns({
              username: item.admin_user,
              password: item.admin_password,
              host: item.address,
              port: item.port,
              db_type: item.db_type,
              schema_name: schema.schemaName,
              table_name: table.table_name,
            })
              .then((data) => {
                console.log(data);
                emit('design', {
                  data,
                  tableName: table.table_name,
                  schemaName: schema.schemaName,
                  connName: item.remark,
                });
              })
              .catch((e) => {
                console.log(e);
                createMessage.error(
                  '获取数据库信息失败，请检查数据库用户名密码是否正确，数据库是否开放连接权限',
                );
              })
              .finally(() => {
                loadingRef.value = false;
              });
          },
        },
      ],
    });
  }

  onMounted(() => {
    getDbList();
  });
</script>
<style lang="less" scoped>
  .conn {
    &:hover {
      padding: 3px 40px 3px 5px;
      width: 260px;
      background-color: #2580f9;
      color: #fff;
    }

    &:active {
      padding: 3px 40px 3px 5px;
      width: 260px;
      background-color: #2580f9;
      color: #fff;
    }
  }
</style>
