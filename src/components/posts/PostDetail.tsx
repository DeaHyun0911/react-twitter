import AuthContext from "context/AuthContext";
import { deleteDoc, doc, getDoc } from "firebase/firestore";
import { db } from "firebaseApp";
import { PostProps } from "pages/home";
import { useContext, useEffect, useState } from "react";
import { AiFillHeart } from "react-icons/ai";
import { FaRegComment, FaUserCircle } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { toast } from "react-toastify";

export default function PostDetail() {
  const navigate = useNavigate();
  const [post, setPost] = useState<PostProps | null>(null);
  const params = useParams();
  const { user } = useContext(AuthContext);

  const getPost = async (id: string) => {
    if (id) {
      const docRef = doc(db, "posts", id);
      const docSnap = await getDoc(docRef);

      setPost({ id: docSnap.id, ...docSnap.data() } as PostProps);
    }
  };

  useEffect(() => {
    if (params?.id) {
      getPost(params?.id);
    }
  }, [params?.id]);

  // 뒤로 돌아가기
  const goBack = () => {
    navigate(-1);
  };

  const handleDelete = async (e: React.MouseEvent) => {
    const confirm = window.confirm("해당 게시글을 삭제하시겠습니까?");

    if (confirm && post?.id) {
      try {
        const docRef = doc(db, "posts", post?.id);
        await deleteDoc(docRef);

        toast.success("게시글이 삭제되었습니다.");
        navigate("/");
      } catch (error: any) {
        console.log(error);
        toast.error(error?.code);
      }
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    navigate(`/posts/edit/${post?.id}`);
  };

  return (
    <div className="post__detail">
      <div className="post__detail__header">
        <div className="post__detail__header-return" onClick={goBack}>
          <FaArrowLeft />
        </div>
        <div className="post__detail__header-title">게시하기</div>
      </div>
      <div className="post__detail-content">
        <div className="post__box">
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

              <div className="post__box-footer">
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

                <button type="button" className="post__likes">
                  <AiFillHeart className="post__icon" />
                  {post?.likeCount || 0}
                </button>
                <button type="button" className="post__comments">
                  <FaRegComment className="post__icon" />
                  {post?.comments?.length || 0}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
