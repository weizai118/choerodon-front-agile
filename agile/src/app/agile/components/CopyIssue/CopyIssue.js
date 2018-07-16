import React, { Component } from 'react';
import { stores, axios, Content } from 'choerodon-front-boot';
import { withRouter } from 'react-router-dom';
import _ from 'lodash';
import { Modal, Form, Input, Checkbox } from 'choerodon-ui';

import './CopyIssue.scss';

const { AppState } = stores;
const FormItem = Form.Item;

class CopyIssue extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    };
  }

  componentDidMount() {
  }

  handleCopyIssue = () => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const projectId = AppState.currentMenuType.id;
        const { visible, onCancel, onOk, issueId, issueNum } = this.props;
        const { issueSummary, copySubIssue, copyLinkIssue, sprint } = values;
        const copyConditionDTO = {
          issueLink: copyLinkIssue || false,
          sprintValues: sprint || false,
          subTask: copySubIssue || false,
          summary: issueSummary || false,
        };
        window.console.log(copyConditionDTO);
        this.setState({
          loading: true,
        });
        axios.post(`/agile/v1/projects/${projectId}/issues/${issueId}/copy_issue`, copyConditionDTO)
          .then((res) => {
            this.setState({
              loading: false,
            });
            this.props.onOk();
          });
      }
    });
  };

  render() {
    const { visible, onCancel, onOk, issueId, issueNum, issueSummary } = this.props;
    const { getFieldDecorator } = this.props.form;
  
    return (
      <Modal
        className="c7n-copyIssue"
        title={`复制问题${issueNum}`}
        visible={visible || false}
        onOk={this.handleCopyIssue}
        onCancel={onCancel}
        okText="复制"
        cancelText="取消"
        confirmLoading={this.state.loading}
      >
        <Form layout="vertical">
          <FormItem>
            {getFieldDecorator('issueSummary', {
              rules: [{ required: true, message: '请输入概要' }],
              initialValue: issueSummary,
            })(
              <Input
                label="概要"
                prefix="CLONE - "
                maxLength={30}
              />,
            )}
          </FormItem>
          {
            this.props.issue.closeSprint.length || this.props.issue.activeSprint ? (
              <FormItem>
                {getFieldDecorator('sprint', {})(
                  <Checkbox>
                    是否复制冲刺
                  </Checkbox>,
                )}
              </FormItem>
            ) : null
          }
          {
            this.props.issue.subIssueDTOList.length ? (
              <FormItem>
                {getFieldDecorator('copySubIssue', {})(
                  <Checkbox>
                    是否复制子任务
                  </Checkbox>,
                )}
              </FormItem>
            ) : null
          }
          {
            this.props.issueLink.length ? (
              <FormItem>
                {getFieldDecorator('copyLinkIssue', {})(
                  <Checkbox>
                    是否复制关联任务
                  </Checkbox>,
                )}
              </FormItem>
            ) : null
          }
        </Form>
      </Modal>
    );
  }
}
export default Form.create({})(withRouter(CopyIssue));