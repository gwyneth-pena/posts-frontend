"use client";

import { format } from "date-fns";
import { useMutation } from "urql";
import { COMMENT_DELETE_MUTATION } from "../graphql/comments.mutations";
import toast from "react-hot-toast";
import CommentForm from "./CommentForm";
import { useState } from "react";

export default function CommentItem({
  comment,
  userMe,
  onSuccess,
  ref,
  isChild = false,
}: {
  comment: any;
  userMe: any;
  onSuccess: any;
  ref: any;
  isChild?: boolean;
}) {
  const isOwner = comment.user.username === userMe?.username;
  const [toUpdate, setToUpdate] = useState(false);
  const [toReply, setToReply] = useState(false);

  const [_, executeCommentDelete] = useMutation(COMMENT_DELETE_MUTATION);

  const deleteComment = async () => {
    const result = await executeCommentDelete({
      id: comment.id,
    });
    if (result.error) {
      window.location.href = "/login";
    } else {
      toast.success("Comment deleted successfully.");
      onSuccess?.();
    }
  };

  return (
    <div
      ref={ref}
      className={`bg-gray-100 px-4 py-2 ${isChild ? "mb-0" : "mb-2"}`}
      key={comment.id}
    >
      <small className="text-muted" style={{ fontSize: "12px" }}>
        {comment.user.username} |{"  "}
        {format(new Date(Number(comment.createdAt)), "PPP 'at' p")}
      </small>

      {toUpdate ? (
        <div className="my-2">
          <CommentForm
            initialValue={comment.text}
            operation="Update"
            postId={comment.postId}
            commentId={comment.id}
            onSuccess={() => {
              setToUpdate(false);
              onSuccess?.();
            }}
          />
        </div>
      ) : (
        <>
          <div
            style={{ fontSize: "12px" }}
            className="mb-0"
            dangerouslySetInnerHTML={{ __html: comment.text }}
          ></div>

          {comment?.children?.map((child: any) => (
            <CommentItem
              ref={ref}
              comment={child}
              userMe={userMe}
              key={child.id}
              isChild={true}
              onSuccess={() => onSuccess?.()}
            />
          ))}

          {toReply && (
            <div className="my-2">
              <CommentForm
                operation="Reply"
                postId={comment.post?.id}
                commentId={comment.id}
                onSuccess={() => {
                  setToReply(false);
                  onSuccess?.();
                }}
              />
            </div>
          )}
        </>
      )}

      {(isOwner || userMe) && (
        <div className="d-flex">
          {!isChild && userMe && (
            <small
              onClick={() => {
                setToReply(!toReply);
                setToUpdate(false);
              }}
              style={{ fontSize: "11px" }}
              className="my-0 py-0 me-2 hover:underline cursor-pointer"
            >
              Reply
            </small>
          )}

          {isOwner && (
            <>
              <small
                onClick={() => {
                  setToUpdate(!toUpdate);
                  setToReply(false);
                }}
                style={{ fontSize: "11px" }}
                className="my-0 py-0 me-2 hover:underline cursor-pointer text-primary"
              >
                Update
              </small>
              <small
                onClick={() => deleteComment()}
                style={{ fontSize: "11px" }}
                className="my-0 py-0 me-2 hover:underline cursor-pointer text-danger"
              >
                Delete
              </small>
            </>
          )}
        </div>
      )}
    </div>
  );
}
