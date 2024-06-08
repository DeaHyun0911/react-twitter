import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  GithubAuthProvider,
  GoogleAuthProvider,
  getAuth,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { app } from "firebaseApp";
import { toast } from "react-toastify";
import { FcGoogle } from "react-icons/fc";
import { SiGithub } from "react-icons/si";

export default function LoginForm() {
  const [error, setError] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate();

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const auth = getAuth(app);
      await signInWithEmailAndPassword(auth, email, password);

      toast.success("로그인에 성공하였습니다.");
      navigate("/");
    } catch (error: any) {
      console.log(error);
      toast.error(error?.code);
    }
  };
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { name, value },
    } = e;

    if (name === "email") {
      setEmail(value);
      const validRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

      if (!value.match(validRegex)) {
        setError("이메일 형식이 올바르지 않습니다.");
      } else {
        setError("");
      }
    }

    if (name === "password") {
      setPassword(value);

      if (value?.length < 8) {
        setError("비밀번호는 8자리 이상으로 입력해주세요.");
      } else {
        setError("");
      }
    }
  };

  const onClickSocialLogin = async (e: any) => {
    e.preventDefault();

    const {
      target: { name },
    } = e;

    let provider;
    const auth = getAuth(app);

    if (name === "google") {
      provider = new GoogleAuthProvider();
    }

    if (name === "github") {
      provider = new GithubAuthProvider();
    }

    await signInWithPopup(
      auth,
      provider as GithubAuthProvider | GoogleAuthProvider
    )
      .then((result) => {
        toast.success("로그인에 성공하였습니다.");
        navigate("/");
      })
      .catch((error) => {
        console.log(error);
        toast.error(error?.code);
      });
  };

  return (
    <form onSubmit={onSubmit} method="POST" className="form form--lg">
      <div className="form__title">로그인</div>
      <div className="form__block">
        <label htmlFor="email">이메일</label>
        <input
          className="focus"
          type="text"
          name="email"
          id="email"
          required
          onChange={onChange}
          value={email}
        />
      </div>
      <div className="form__block">
        <label htmlFor="password">비밀번호</label>
        <input
          className="focus"
          type="password"
          name="password"
          id="password"
          required
          onChange={onChange}
          value={password}
        />
      </div>
      {error && error?.length > 0 && (
        <div className="form__block form__error">{error}</div>
      )}
      <div className="form__block">
        계정이 없으신가요?
        <Link to="/signup" className="form__link">
          가입하기
        </Link>
      </div>
      <div className="form__block">
        <button type="submit" className="form__btn form__btn-submit">
          로그인
        </button>
      </div>
      <div className="form__block">
        <button
          type="button"
          name="google"
          className="form__btn form__btn-white"
          onClick={onClickSocialLogin}
        >
          <FcGoogle className="form__social-icon" /> Google으로 시작하기
        </button>
      </div>
      <div className="form__block">
        <button
          type="button"
          name="github"
          className="form__btn form__btn-white"
          onClick={onClickSocialLogin}
        >
          <SiGithub className="form__social-icon" /> Github으로 시작하기
        </button>
      </div>
    </form>
  );
}
