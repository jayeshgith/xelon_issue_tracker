import { Send, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { ROLE_LABELS } from '../../constants/options.js';
import { useAuth } from '../../context/AuthContext.jsx';
import * as commentService from '../../services/commentService.js';
import { formatDate, fullName, getApiError } from '../../utils/formatters.js';
import Alert from '../common/Alert.jsx';
import Button from '../common/Button.jsx';
import EmptyState from '../common/EmptyState.jsx';
import ErrorState from '../common/ErrorState.jsx';
import LoadingState from '../common/LoadingState.jsx';
import Textarea from '../common/Textarea.jsx';

const avatarTones = {
  admin: 'bg-gradient-to-br from-brand-500 to-brand-700',
  developer: 'bg-gradient-to-br from-sky-500 to-cyan-600',
  user: 'bg-gradient-to-br from-slate-400 to-slate-600'
};

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
    <section className="space-y-4" aria-label="Comments">
      <div className="panel p-5 sm:p-6">
        <div className="flex items-center gap-3">
          <h2 className="text-base font-semibold text-slate-950">Comments</h2>
          <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-500">
            {comments.length}
          </span>
        </div>
        <div className="mt-5 space-y-4">
          {comments.length ? (
            comments.map((comment) => {
              const canDelete = user?.role === 'admin' || comment.user?._id === user?._id;
              const author = comment.user;
              const initials = `${author?.firstName?.[0] || ''}${author?.lastName?.[0] || ''}`.toUpperCase() || '?';

              return (
                <article key={comment._id} className="flex gap-3.5">
                  <span
                    className={`grid h-9 w-9 shrink-0 place-items-center rounded-full text-xs font-bold text-white ${avatarTones[author?.role] || avatarTones.user}`}
                    aria-hidden="true"
                  >
                    {initials}
                  </span>
                  <div className="min-w-0 flex-1 rounded-xl border border-slate-200/80 bg-slate-50/60 px-4 py-3">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-semibold text-slate-900">{fullName(comment.user)}</p>
                        <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-slate-500 ring-1 ring-inset ring-slate-200">
                          {ROLE_LABELS[comment.user?.role] || 'User'}
                        </span>
                      </div>
                      <div className="flex shrink-0 items-center gap-2">
                        <p className="text-xs text-slate-400">{formatDate(comment.createdAt)}</p>
                        {canDelete ? (
                          <Button
                            variant="ghost"
                            size="icon"
                            title="Delete comment"
                            aria-label="Delete comment"
                            className="h-8 w-8 p-0 hover:bg-rose-50 hover:text-rose-600"
                            onClick={() => handleDelete(comment)}
                          >
                            <Trash2 size={14} />
                          </Button>
                        ) : null}
                      </div>
                    </div>
                    <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-slate-700">{comment.text}</p>
                  </div>
                </article>
              );
            })
          ) : (
            <EmptyState title="No comments yet" description="Add the first update for this issue." />
          )}
        </div>
      </div>
      <form className="panel p-5 sm:p-6" onSubmit={handleSubmit}>
        {error ? (
          <div className="mb-4">
            <Alert variant="error">{error}</Alert>
          </div>
        ) : null}
        <Textarea id="comment" label="Add a comment" value={text} onChange={(event) => setText(event.target.value)} placeholder="Share an update, a question, or progress on this issue..." />
        <div className="mt-3 flex justify-end">
          <Button type="submit" disabled={submitting || !text.trim()}>
            <Send size={16} />
            {submitting ? 'Posting...' : 'Post comment'}
          </Button>
        </div>
      </form>
    </section>
  );
};

export default CommentThread;