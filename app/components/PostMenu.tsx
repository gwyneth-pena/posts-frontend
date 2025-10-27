"use client";

import { IconDotsVertical } from "@tabler/icons-react";
import { useState } from "react";
import ConfirmationModal from "./ConfirmationModal";
import { useMutation, useQuery } from "urql";
import { POSTS_DELETE_MUTATION } from "../graphql/posts.mutation";
import toast from "react-hot-toast";
import { POSTS_GET_ONE_QUERY } from "../graphql/posts.query.";
import { USER_ME_QUERY } from "../graphql/users.query";

export default function PostMenu({ id }: any) {
  const [{ data: postData }] = useQuery({
    query: POSTS_GET_ONE_QUERY,
    variables: { id: id },
    requestPolicy: "cache-and-network",
  });

  const [{ data: userData }] = useQuery({
    query: USER_ME_QUERY,
    requestPolicy: "cache-and-network",
  });

  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [_, executePostDelete] = useMutation(POSTS_DELETE_MUTATION);
  const handleConfirm = async () => {
    const result = await executePostDelete({
      id: id,
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

  if (postData?.post?.user?.username !== userData?.userMe?.username) {
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
            <a className="dropdown-item" href={`/posts/${id}/edit`}>
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
          message="Are you sure you want to delete this post?"
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
