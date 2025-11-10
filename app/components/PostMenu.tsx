"use client";

import { IconDotsVertical } from "@tabler/icons-react";
import { useState } from "react";
import ConfirmationModal from "./ConfirmationModal";
import { useMutation } from "urql";
import { POSTS_DELETE_MUTATION } from "../graphql/posts.mutation";
import toast from "react-hot-toast";

export default function PostMenu({
  post,
  fromPage,
  isFromSinglePost = false,
}: {
  post: any;
  fromPage?: number;
  isFromSinglePost?: boolean;
}) {
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [_, executePostDelete] = useMutation(POSTS_DELETE_MUTATION);
  const handleConfirm = async () => {
    const result = await executePostDelete({
      id: post?.id,
    });
    if (result.error) {
      toast.error("Something went wrong. Try again.");
    } else {
      setShowConfirmationModal(false);
      toast.success("Post deleted successfully.");
      setTimeout(() => window.location.reload(), 1000);
    }
  };

  const handleCancel = () => {
    setShowConfirmationModal(false);
  };

  if (!post?.isOwner) {
    return;
  }

  return (
    <>
      <div className="dropdown">
        <button
          className="btn btn-link p-0"
          type="button"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          <IconDotsVertical size={20} />
        </button>
        <ul className="dropdown-menu dropdown-menu-end">
          <li>
            <a
              className="dropdown-item"
              href={`/posts/${post?.slug}/edit?single=${isFromSinglePost}${
                fromPage ? `&fromPage=${fromPage}` : ""
              }`}
            >
              Edit
            </a>
          </li>
          <li>
            <a
              className="dropdown-item text-danger"
              onClick={() => setShowConfirmationModal(true)}
            >
              Delete
            </a>
          </li>
        </ul>
      </div>
      {showConfirmationModal && (
        <ConfirmationModal
          title="Delete Post"
          message={`Are you sure you want to delete this post (${post?.title})?`}
          confirmText="Delete"
          cancelText="Cancel"
          show={showConfirmationModal}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      )}
    </>
  );
}
