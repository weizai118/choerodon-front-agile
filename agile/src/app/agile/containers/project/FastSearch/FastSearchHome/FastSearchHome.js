import React, { Component } from 'react';
import { observer } from 'mobx-react';
import {
  Button, Table, Spin, Popover, Tooltip, Icon, Modal, 
} from 'choerodon-ui';
import {
  Page, Header, Content, stores, axios, 
} from 'choerodon-front-boot';
import Filter from './Component/Filter';
import EditFilter from './Component/EditFilter';
import DeleteFilter from './Component/DeleteFilter';
import SortTable from './Component/SortTable';
import './FastSearchHome.scss';

const { AppState } = stores;
const confirm = Modal.confirm;

@observer
class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filters: [],
      createFileterShow: false,
      currentFilterId: undefined,
      filter: {},
      confirmShow: false,

      loading: false,
      editComponentShow: false,
      createComponentShow: false,
    };
  }

  componentDidMount() {
    this.loadFilters();
  }

  showFilter(record) {
    this.setState({
      editFilterShow: true,
      currentFilterId: record.filterId,
    });
  }

  clickDeleteFilter(record) {
    this.setState({
      filter: record,
      deleteFilterShow: true,
    });
  }

  deleteComponent() {
    this.setState({
      confirmShow: false,
    });
    this.loadComponents();
  }

  loadFilters() {
    this.setState({
      loading: true,
    });
    axios
      .get(`/agile/v1/projects/${AppState.currentMenuType.id}/quick_filter`)
      .then((res) => {
        this.setState({
          filters: res,
          loading: false,
        });
      })
      .catch((error) => {});
  }

  handleDrag = (data, postData) => {
    this.setState({
      filters: data,
    });
    axios
      .put(`/agile/v1/projects/${AppState.currentMenuType.id}/quick_filter/drag`, postData)
      .then(() => {
        axios.get(`/agile/v1/projects/${AppState.currentMenuType.id}/quick_filter`).then((res) => {
          this.setState({
            filters: res,
          });
        });
      })
      .catch(() => {
        axios.get(`/agile/v1/projects/${AppState.currentMenuType.id}/quick_filter`).then((ress) => {
          this.setState({
            filters: ress,
          });
        });
      });
  };

  transformOperation = (str) => {
    // 注意该对象key的顺序
    const OPERATION = {
      '!=': '不等于',
      'not in': '不包含',
      in: '包含',
      'is not': '不是',
      is: '是',
      '<=': '小于或等于',
      '<': '小于',
      '>=': '大于或等于',
      '>': '大于',
      '=': '等于',
    };
    
    let transformKey = '';
    transformKey = Object.keys(OPERATION).find(item => str.match(item)) && Object.keys(OPERATION).find(item => str.match(item));
    return str.replace(transformKey, OPERATION[transformKey]);
  };

  render() {
    const column = [
      {
        title: '名称',
        dataIndex: 'name',
        // width: '20%',
        render: name => (
          <div style={{ width: '100%', overflow: 'hidden' }}>
            <Tooltip placement="topLeft" mouseEnterDelay={0.5} title={name}>
              <p
                style={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  marginBottom: 0,
                }}
              >
                {name}
              </p>
            </Tooltip>
          </div>
        ),
      },
      {
        title: '筛选器',
        dataIndex: 'expressQuery',
        // width: '50%',
        render: expressQuery => (
          <div style={{ width: '100%', overflow: 'hidden' }}>
            <Tooltip placement="topLeft" mouseEnterDelay={0.5} title={this.transformOperation(expressQuery)}>
              <p
                style={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  marginBottom: 0,
                }}
              >
                {/* {expressQuery} */}
                {this.transformOperation(expressQuery)}
              </p>
            </Tooltip>
          </div>
        ),
      },
      {
        title: '描述',
        dataIndex: 'description',
        // width: '25%',
        render: description => (
          <div style={{ width: '100%', overflow: 'hidden' }}>
            <Tooltip placement="topLeft" mouseEnterDelay={0.5} title={description.split('+++')[0]}>
              <p
                style={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  marginBottom: 0,
                }}
              >
                {description.split('+++')[0] || ''}
              </p>
            </Tooltip>
          </div>
        ),
      },
      {
        title: '',
        dataIndex: 'filterId',
        width: '96',
        align: 'right',
        render: (filterId, record) => (
          <div>
            <Popover
              placement="bottom"
              mouseEnterDelay={0.5}
              content={(
                <div>
                  <span>详情</span>
                </div>
)}
            >
              {/* <Button shape="circle" onClick={this.showFilter.bind(this, record)}> */}
              <Icon type="mode_edit" onClick={this.showFilter.bind(this, record)} />
              {/* </Button> */}
            </Popover>
            <Popover
              placement="bottom"
              mouseEnterDelay={0.5}
              content={(
                <div>
                  <span>删除</span>
                </div>
)}
            >
              {/* <Button shape="circle" onClick={this.clickDeleteFilter.bind(this, record)}> */}
              <Icon type="delete_forever" onClick={this.clickDeleteFilter.bind(this, record)} />
              {/* </Button> */}
            </Popover>
          </div>
        ),
      },
    ];
    return (
      <Page className="c7n-fast-search">
        <Header title="快速搜索">
          <Button funcType="flat" onClick={() => this.setState({ createFileterShow: true })}>
            <Icon type="playlist_add icon" />
            <span>创建快速搜索</span>
          </Button>
          <Button funcType="flat" onClick={() => this.loadFilters()}>
            <Icon type="refresh icon" />
            <span>刷新</span>
          </Button>
        </Header>
        <Content
          title="快速搜索"
          description="通过定义快速搜索，可以在待办事项和活跃冲刺的快速搜索工具栏生效，帮助您更好的筛选过滤问题面板。"
          link="http://v0-10.choerodon.io/zh/docs/user-guide/agile/setup/quick-search/"
        >
          <div>
            <Spin spinning={this.state.loading}>
              <SortTable
                handleDrag={this.handleDrag}
                rowKey={record => record.filterId}
                columns={column}
                dataSource={this.state.filters}
                scroll={{ x: true }}
              />
            </Spin>
            {this.state.createFileterShow ? (
              <Filter
                onOk={() => {
                  this.setState({ createFileterShow: false });
                  this.loadFilters();
                }}
                onCancel={() => this.setState({ createFileterShow: false })}
              />
            ) : null}
            {this.state.editFilterShow ? (
              <EditFilter
                filterId={this.state.currentFilterId}
                onOk={() => {
                  this.setState({ editFilterShow: false });
                  this.loadFilters();
                }}
                onCancel={() => this.setState({ editFilterShow: false })}
              />
            ) : null}
            {this.state.deleteFilterShow ? (
              <DeleteFilter
                filter={this.state.filter}
                onOk={() => {
                  this.setState({ deleteFilterShow: false });
                  this.loadFilters();
                }}
                onCancel={() => this.setState({ deleteFilterShow: false })}
              />
            ) : null}
          </div>
        </Content>
      </Page>
    );
  }
}

export default Search;
