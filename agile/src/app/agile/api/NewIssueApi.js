import { stores, axios } from 'choerodon-front-boot';

const { AppState } = stores;

export function createIssue(issueObj, projectId = AppState.currentMenuType.id) {
  const issue = {
    projectId,
    ...issueObj,
  };
  return axios.post(`/agile/v1/projects/${projectId}/issues?applyType=agile`, issue);
}

export function loadLabels() {
  const projectId = AppState.currentMenuType.id;
  return axios.get(
    `/agile/v1/projects/${projectId}/issue_labels`,
  );
}

export function loadVersions(arr = []) {
  const projectId = AppState.currentMenuType.id;
  return axios.post(`/agile/v1/projects/${projectId}/product_version/names`, arr);
}

export function createCommit(commitObj, projectId = AppState.currentMenuType.id) {
  return axios.post(`/agile/v1/projects/${projectId}/issue_comment`, commitObj);
}

export function updateCommit(commitObj, projectId = AppState.currentMenuType.id) {
  return axios.post(`/agile/v1/projects/${projectId}/issue_comment/update`, commitObj);
}

export function deleteCommit(commitId, projectId = AppState.currentMenuType.id) {
  return axios.delete(`/agile/v1/projects/${projectId}/issue_comment/${commitId}`);
}

// export function loadComponents() {
//   const projectId = AppState.currentMenuType.id;
//   return axios.get(
//     `/agile/v1/projects/${projectId}/component`,
//   );
// }

export function loadComponents() {
  const projectId = AppState.currentMenuType.id;
  return axios.post(
    `/agile/v1/projects/${projectId}/component/query_all`, {
      advancedSearchArgs: {},
      searchArgs: {},
      content: '',
    },
  );
}

export function loadEpics() {
  const projectId = AppState.currentMenuType.id;
  return axios.get(
    `/agile/v1/projects/${projectId}/issues/epics/select_data`,
  );
}

/**
 * 根据冲刺状态获取冲刺，["started", "sprint_planning", "closed"]
 * @param {*} arr
 */
export function loadSprints(arr = []) {
  const projectId = AppState.currentMenuType.id;
  return axios.post(`/agile/v1/projects/${projectId}/sprint/names`, arr);
}

export function loadSprint(sprintId) {
  const projectId = AppState.currentMenuType.id;
  return axios.get(`/agile/v1/projects/${projectId}/sprint/${sprintId}`);
}

export function loadSprintIssues(sprintId, status, page = 0, size = 99999) {
  const orgId = AppState.currentMenuType.organizationId;
  const projectId = AppState.currentMenuType.id;
  return axios.get(`/agile/v1/projects/${projectId}/sprint/${sprintId}/issues?organizationId=${orgId}&status=${status}&page=${page}&size=${size}`);
}

export function loadChartData(id, type) {
  const projectId = AppState.currentMenuType.id;
  return axios.get(`/agile/v1/projects/${projectId}/reports/${id}/burn_down_report?type=${type}`);
}

export function loadStatus(statusId, issueId, typeId) {
  const projectId = AppState.currentMenuType.id;
  return axios.get(
    `/issue/v1/projects/${projectId}/schemes/query_transforms?current_status_id=${statusId}&issue_id=${issueId}&issue_type_id=${typeId}&apply_type=agile`,
  );
}

// 调用issue服务
export function loadPriorities() {
  const projectId = AppState.currentMenuType.id;
  const orgId = AppState.currentMenuType.organizationId;
  return axios.get(`/issue/v1/projects/${projectId}/priority/list_by_org`);
}

export function loadIssue(issueId, projectId = AppState.currentMenuType.id) {
  const orgId = AppState.currentMenuType.organizationId;
  return axios.get(`/agile/v1/projects/${projectId}/issues/${issueId}?organizationId=${orgId}`);
}

export function loadSubtask(issueId, projectId = AppState.currentMenuType.id) {
  return axios.get(`agile/v1/projects/${projectId}/issues/sub_issue/${issueId}`);
}

export function updateIssue(data, projectId = AppState.currentMenuType.id) {
  // if (type === 'sub_task') {
  //   return axios.put(`agile/v1/projects/${projectId}/issues/sub_issue`, data);
  // }
  return axios.put(`/agile/v1/projects/${projectId}/issues`, data);
}

export function updateStatus(transformId, issueId, objVerNum, proId = AppState.currentMenuType.id) {
  return axios.put(`/agile/v1/projects/${proId}/issues/update_status?applyType=agile&transformId=${transformId}&issueId=${issueId}&objectVersionNumber=${objVerNum}`);
}

export function createSubIssue(issueId, obj, projectId = AppState.currentMenuType.id) {
  const subIssueObj = {
    ...obj,
    parentIssueId: issueId,
  };
  return axios.post(`/agile/v1/projects/${projectId}/issues/sub_issue`, subIssueObj);
}

export function deleteIssue(issueId, projectId = AppState.currentMenuType.id) {
  return axios.delete(`/agile/v1/projects/${projectId}/issues/${issueId}`);
}

export function deleteLink(issueLinkId, projectId = AppState.currentMenuType.id) {
  return axios.delete(`/agile/v1/projects/${projectId}/issue_links/${issueLinkId}`);
}

export function createWorklog(data, projectId = AppState.currentMenuType.id) {
  return axios.post(`/agile/v1/projects/${projectId}/work_log`, data);
}

export function loadWorklogs(issueId, projectId = AppState.currentMenuType.id) {
  return axios.get(`agile/v1/projects/${projectId}/work_log/issue/${issueId}`);
}

export function loadDatalogs(issueId, projectId = AppState.currentMenuType.id) {
  return axios.get(`agile/v1/projects/${projectId}/data_log?issueId=${issueId}`);
}

export function loadBranchs(issueId, projectId = AppState.currentMenuType.id) {
  return axios.get(`/devops/v1/project/${projectId}/issue/${issueId}/commit_and_merge_request/count`);
}


export function updateWorklog(logId, worklog, projectId = AppState.currentMenuType.id) {
  return axios.patch(`agile/v1/projects/${projectId}/work_log/${logId}`, worklog);
}

export function deleteWorklog(logId, projectId = AppState.currentMenuType.id) {
  return axios.delete(`agile/v1/projects/${projectId}/work_log/${logId}`);
}

export function updateIssueType(data, projectId = AppState.currentMenuType.id) {
  const orgId = AppState.currentMenuType.organizationId;
  const issueUpdateTypeDTO = {
    projectId,
    ...data,
  };
  return axios.post(`/agile/v1/projects/${projectId}/issues/update_type?organizationId=${orgId}`, issueUpdateTypeDTO);
}

export function loadIssues(page = 0, size = 10, searchDTO, orderField, orderType) {
  const orgId = AppState.currentMenuType.organizationId;
  const projectId = AppState.currentMenuType.id;
  return axios.post(`/agile/v1/projects/${projectId}/issues/include_sub?organizationId=${orgId}&page=${page}&size=${size}`, searchDTO, {
    params: {
      sort: `${orderField && orderType ? `${orderField},${orderType}` : ''}`,
    },
  });
}

export function loadIssuesInLink(page = 0, size = 10, issueId, content) {
  const projectId = AppState.currentMenuType.id;
  if (content) {
    return axios.get(`/agile/v1/projects/${projectId}/issues/agile/summary?issueId=${issueId}&self=false&content=${content}&page=${page}&size=${size}`);
  } else {
    return axios.get(`/agile/v1/projects/${projectId}/issues/agile/summary?issueId=${issueId}&self=false&page=${page}&size=${size}`);
  }
}

export function createLink(issueId, issueLinkCreateDTOList) {
  const projectId = AppState.currentMenuType.id;
  return axios.post(`/agile/v1/projects/${projectId}/issue_links/${issueId}`, issueLinkCreateDTOList);
}

export function loadLinkIssues(issueId) {
  const projectId = AppState.currentMenuType.id;
  return axios.get(`/agile/v1/projects/${projectId}/issue_links/${issueId}?no_issue_test=true`);
}
