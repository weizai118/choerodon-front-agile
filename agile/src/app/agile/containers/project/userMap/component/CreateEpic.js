import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Modal, Form, Select, Icon, Input } from 'choerodon-ui';
import { Content, stores } from 'choerodon-front-boot';
// import this.props.store from '../../../../../stores/project/backlog/this.props.store';

const { AppState } = stores;
const { Sidebar } = Modal;
const FormItem = Form.Item;
const Option = Select.Option;
const { TextArea } = Input;

@observer
class CreateEpic extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    };
  }

  /**
   *
   * 创建史诗
   * @param {*} e
   * @memberof CreateEpic
   */
  handleCreateEpic =(e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, value) => {
      if (!err) {
        const data = {
          priorityCode: 'medium',
          projectId: AppState.currentMenuType.id,
          epicName: value.name,
          summary: value.summary,
          typeCode: 'issue_epic',
        };
        this.setState({
          loading: true,
        });
        this.props.store.axiosEasyCreateIssue(data).then((res) => {
          this.setState({
            loading: false,
          });
          this.props.form.resetFields();
          this.props.onCancel();
          this.props.store.axiosGetEpic().then((data3) => {
            const newEpic = [...data3];
            for (let index = 0, len = newEpic.length; index < len; index += 1) {
              newEpic[index].expand = false;
            }
            this.props.store.setEpicData(newEpic);
          }).catch((error3) => {
          });
        }).catch((error) => {
          this.setState({
            loading: false,
          });
        });
      }
    });
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Sidebar
        title="创建史诗"
        visible={this.props.visible}
        okText="新建"
        cancelText="取消"
        onCancel={() => {
          this.props.form.resetFields();
          this.props.onCancel();
        }}
        confirmLoading={this.state.loading}
        onOk={this.handleCreateEpic}
      >
        <Content
          style={{
            padding: 0,
          }}
          title={`创建项目“${AppState.currentMenuType.name}”的史诗`}
          description="请在下面输入史诗名称、概要，创建新史诗。"
          link="http://v0-8.choerodon.io/zh/docs/user-guide/agile/backlog/epic/"
        >
          <Form style={{ width: 512 }}>
            <FormItem>
              {getFieldDecorator('type', {
                initialValue: 'epic',
                rules: [{
                  required: true,
                  message: '',
                }],
              })(
                <Select size="small" disabled label="问题类型">
                  <Option value="epic">
                    <div style={{ display: 'inline-flex', alignItems: 'center', margin: '5px 0' }}>
                      <div
                        style={{
                          width: 20,
                          height: 20,
                          borderRadius: '50%',
                          background: '#743BE7',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}
                      >
                        <Icon style={{ color: 'white' }} type="priority" />
                      </div>
                      <p style={{ marginLeft: 8 }}>史诗</p>
                    </div>
                  </Option>
                </Select>,
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator('name', {
                rules: [{
                  required: true,
                  message: '史诗名称不能为空',
                }],
              })(
                <Input label="史诗名称" maxLength={44} />,
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator('summary', {
                rules: [{
                  required: true,
                  message: '概要不能为空',
                }],
              })(
                <TextArea autosize label="概要" maxLength={44} />,
              )}
            </FormItem>
          </Form>
        </Content>
      </Sidebar>
    );
  }
}

export default Form.create()(CreateEpic);
