import AuthContext from "context/AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "firebaseApp";
import { PostProps } from "pages/home";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

export default function PostEdit() {
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

  return (
    <div className="post__detail">
      <div className="post__detail__header">
        <div className="post__detail__header-return" onClick={goBack}>
          <FaArrowLeft />
        </div>
        <div className="post__detail__header-title">게시하기</div>
      </div>
    </div>
  );
}
