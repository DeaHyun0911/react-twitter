import AuthContext from "context/AuthContext";
import { collection, addDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "firebaseApp";
import { PostProps } from "pages/home";
import { useContext, useEffect, useState } from "react";
import { GoImage } from "react-icons/go";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { AiFillHeart } from "react-icons/ai";

export default function PostForm() {
  const params = useParams();
  const [post, setPost] = useState<PostProps | null>(null);
  const [content, setContent] = useState<string>("");
  const [image, setImage] = useState<string | null>(null);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const getPost = async (id: string) => {
    if (id) {
      const docRef = doc(db, "posts", id);
      const docSnap = await getDoc(docRef);

      setPost({ id: docSnap.id, ...docSnap.data() } as PostProps);
    }
  };

  const handleFileUpload = (e: any) => {
    const {
      target: { files },
    } = e;

    const file = files?.[0];
    const fileReader = new FileReader();

    // 파일을 Data URL 형식으로 변환
    console.log(fileReader?.readAsDataURL(file));

    // 결과를 state에 저장
    fileReader.onloadend = (e: any) => {
      const { result } = e?.currentTarget;
      setImage(result);
    };
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      if (post && post.id) {
        const postRef = doc(db, "posts", post?.id);
        await updateDoc(postRef, {
          content: content,
          updatedAt: new Date().toLocaleDateString("ko", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          }),
        });

        toast.success("게시글을 수정했습니다.");
        navigate(`/posts/${post.id}`);
      } else {
        await addDoc(collection(db, "posts"), {
          email: user?.email,
          uid: user?.uid,
          content: content,
          createdAt: new Date().toLocaleDateString("ko", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          }),
        });

        setContent("");
        toast.success("게시글을 생성했습니다.");
      }
    } catch (e: any) {
      console.log(e);
      toast.error(e?.code);
    }
  };

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    // setContent(e.target.value);

    const {
      target: { name, value },
    } = e;

    if (name === "content") {
      setContent(value);
    }
  };

  useEffect(() => {
    if (params?.id) {
      getPost(params?.id);
    }
  }, [params?.id]);

  useEffect(() => {
    if (post && user) {
      if (post?.uid === user?.uid) {
        setContent(post?.content);
      }
    }
  }, [post, user]);

  return (
    <form className="post-form" onSubmit={onSubmit}>
      <textarea
        className="post-form__textarea"
        required
        name="content"
        id="content"
        placeholder="What's happening?"
        onChange={onChange}
        value={content}
      ></textarea>
      <div className="post-form__submit-area">
        <label htmlFor="file-input" className="post-form__file">
          <GoImage className="post-form__icon" />
        </label>
        <input
          type="file"
          name="file-input"
          accept="image/*"
          id="file-input"
          onChange={handleFileUpload}
          className="hidden"
        />
        <input type="submit" value="Tweet" className="post-form__submit" />
      </div>
    </form>
  );
}
