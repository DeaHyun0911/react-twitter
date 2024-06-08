import AuthContext from "context/AuthContext";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "firebaseApp";
import { PostProps } from "pages/home";
import { useContext } from "react";
import { AiFillHeart } from "react-icons/ai";
import { FaRegComment, FaUserCircle } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

interface PostBoxProps {
  post: PostProps;
}

export default function PostBox({ post }: PostBoxProps) {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    const confirm = window.confirm("해당 게시글을 삭제하시겠습니까?");

    if (confirm) {
      try {
        const docRef = doc(db, "posts", post?.id);
        await deleteDoc(docRef);
        toast.success("게시글이 삭제되었습니다.");
      } catch (error: any) {
        console.log(error);
        toast.error(error?.code);
      }
    }
  };

  const RemoveLink = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
  };

  const handleEdit = (e: React.MouseEvent) => {
    navigate(`/posts/edit/${post?.id}`);
  };

  return (
    <div className="post__box" key={post?.id}>
      <Link to={`/posts/${post?.id}`}>
        <div className="post__flex">
          <div className="post__profile-img">
            {post?.profileUrl ? (
              <img
                src={post?.profileUrl}
                alt="profile"
                className="post__box-profile-img"
              />
            ) : (
              <FaUserCircle className="post__box-profile-icon" />
            )}
          </div>
          <div className="post__box-content">
            <div className="post__profile-box">
              <div className="post__email">{post?.email}</div>
              <div className="post__createdAt">{post?.createdAt}</div>
            </div>
            <div className="post__content">{post?.content}</div>

            <div className="post__box-footer" onClick={RemoveLink}>
              {post?.uid === user?.uid && (
                <>
                  <button
                    type="button"
                    className="post_delete"
                    onClick={handleDelete}
                  >
                    Delete
                  </button>
                  <button
                    type="button"
                    className="post_edit"
                    onClick={handleEdit}
                  >
                    Edit
                  </button>
                </>
              )}

              <button
                type="button"
                className="post__likes"
                onClick={RemoveLink}
              >
                <AiFillHeart className="post__icon" />
                {post?.likeCount || 0}
              </button>
              <button
                type="button"
                className="post__comments"
                onClick={RemoveLink}
              >
                <FaRegComment className="post__icon" />
                {post?.comments?.length || 0}
              </button>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
