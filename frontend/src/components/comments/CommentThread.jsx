import { Send, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import * as commentService from '../../services/commentService.js';
import { formatDate, fullName, getApiError } from '../../utils/formatters.js';
import Button from '../common/Button.jsx';
import EmptyState from '../common/EmptyState.jsx';
import ErrorState from '../common/ErrorState.jsx';
import LoadingState from '../common/LoadingState.jsx';
import Textarea from '../common/Textarea.jsx';

const CommentThread = ({ issueId }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const loadComments = async () => {
    setLoading(true);
    setError('');

    try {
      setComments(await commentService.getComments(issueId));
    } catch (apiError) {
      setError(getApiError(apiError, 'Unable to load comments'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComments();
  }, [issueId]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!text.trim()) {
      return;
    }

    setSubmitting(true);

    try {
      const comment = await commentService.createComment(issueId, text);
      setComments((current) => [...current, comment]);
      setText('');
    } catch (apiError) {
      setError(getApiError(apiError, 'Unable to add comment'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (comment) => {
    if (!window.confirm('Delete this comment?')) {
      return;
    }

    await commentService.deleteComment(comment._id);
    setComments((current) => current.filter((item) => item._id !== comment._id));
  };

  if (loading) {
    return <LoadingState label="Loading comments..." />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={loadComments} />;
  }

  return (
    <section className="space-y-4">
      <div className="panel p-5">
        <h2 className="text-base font-semibold text-slate-950">Comments</h2>
        <div className="mt-4 space-y-3">
          {comments.length ? (
            comments.map((comment) => {
              const canDelete = user?.role === 'admin' || comment.user?._id === user?._id;

              return (
                <div key={comment._id} className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-950">
                        {fullName(comment.user)}
                        <span className="ml-2 text-xs font-medium uppercase text-slate-400">{comment.user?.role}</span>
                      </p>
                      <p className="text-xs text-slate-500">{formatDate(comment.createdAt)}</p>
                    </div>
                    {canDelete ? (
                      <Button variant="ghost" size="icon" title="Delete comment" onClick={() => handleDelete(comment)}>
                        <Trash2 size={15} />
                      </Button>
                    ) : null}
                  </div>
                  <p className="mt-3 whitespace-pre-line text-sm text-slate-700">{comment.text}</p>
                </div>
              );
            })
          ) : (
            <EmptyState title="No comments yet" description="Add the first update for this issue." />
          )}
        </div>
      </div>
      <form className="panel space-y-3 p-5" onSubmit={handleSubmit}>
        <Textarea id="comment" label="Add Comment" value={text} onChange={(event) => setText(event.target.value)} />
        <Button type="submit" disabled={submitting || !text.trim()}>
          <Send size={16} />
          {submitting ? 'Posting...' : 'Post comment'}
        </Button>
      </form>
    </section>
  );
};

export default CommentThread;
