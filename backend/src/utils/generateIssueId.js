import Issue from '../models/Issue.js';

const generateIssueId = async () => {
  const latestIssue = await Issue.findOne({ issueId: /^XEL-\d+$/ })
    .sort({ createdAt: -1 })
    .select('issueId');

  if (!latestIssue?.issueId) {
    return 'XEL-1001';
  }

  const lastNumber = Number(latestIssue.issueId.replace('XEL-', ''));
  return `XEL-${lastNumber + 1}`;
};

export default generateIssueId;
