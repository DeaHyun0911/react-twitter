import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { SiGithub } from "react-icons/si";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
} from "firebase/auth";
import { app } from "firebaseApp";
import { toast } from "react-toastify";

export default function SignupForm() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordConfirmation, setPasswordConfirmation] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");
  const [passwordConfirmationError, setPasswordConfirmationError] =
    useState<string>("");
  const navigate = useNavigate();

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const auth = getAuth(app);
      await createUserWithEmailAndPassword(auth, email, password);

      toast.success("회원가입에 성공하였습니다.");
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
        setEmailError("이메일 형식이 올바르지 않습니다.");
      } else {
        setEmailError("");
      }
    }

    if (name === "password") {
      setPassword(value);
      const passWordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+[\]{};':"\\|,.<>/?`~\-]).{8,16}$/;

      if (!value.match(passWordRegex)) {
        setPasswordError(
          "비밀번호는 8~16자의 영문 대/소문자, 숫자, 특수문자를 사용해 주세요."
        );
      } else if (
        passwordConfirmation?.length > 0 &&
        value !== passwordConfirmation
      ) {
        setPasswordError("비밀번호와 값이 다릅니다. 다시 확인해주세요.");
      } else {
        setPasswordError("");
      }
    }

    if (name === "password_confirmation") {
      setPasswordConfirmation(value);

      if (value !== password) {
        setPasswordConfirmationError(
          "비밀번호와 값이 다릅니다. 다시 확인해주세요."
        );
      } else {
        setPasswordConfirmationError("");
      }
    }
  };

  const onBlur = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { name, value },
    } = e;

    if (name === "email") {
      if (value.length === 0) {
        setEmailError("이메일은 필수값입니다.");
      }
    }

    if (name === "password") {
      if (value.length === 0) {
        setPasswordError("비밀번호은 필수값입니다.");
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
      <div className="form__title">회원가입</div>
      <div className="form__block">
        <label htmlFor="email">이메일</label>
        <input
          className={emailError ? "error" : "focus"}
          type="text"
          name="email"
          id="email"
          required
          onChange={onChange}
          onBlur={onBlur}
          value={email}
        />
      </div>
      <div className="form__block">
        <label htmlFor="password">비밀번호</label>
        <input
          className={passwordError ? "error" : "focus"}
          type="password"
          name="password"
          id="password"
          required
          onChange={onChange}
          value={password}
        />
      </div>
      <div className="form__block">
        <label htmlFor="password_confirmation">비밀번호 확인</label>
        <input
          className={passwordConfirmationError ? "error" : "focus"}
          type="password"
          name="password_confirmation"
          id="password_confirmation"
          required
          onChange={onChange}
          value={passwordConfirmation}
        />
      </div>
      {emailError ? (
        <div className="form__block form__error">{emailError}</div>
      ) : null}
      {passwordError ? (
        <div className="form__block form__error">{passwordError}</div>
      ) : null}
      {passwordConfirmationError ? (
        <div className="form__block form__error">
          {passwordConfirmationError}
        </div>
      ) : null}
      <div className="form__block">
        계정이 있으신가요?
        <Link to="/login" className="form__link">
          로그인하기
        </Link>
      </div>
      <div className="form__block">
        <button
          type="submit"
          className="form__btn form__btn-submit"
          disabled={emailError?.length > 0 || passwordError?.length > 0}
        >
          회원가입
        </button>
      </div>
      <div className="form__block">
        <button
          type="button"
          name="google"
          className="form__btn form__btn-white"
          onClick={onClickSocialLogin}
        >
          <FcGoogle className="form__social-icon" /> Google로 가입하기
        </button>
      </div>
      <div className="form__block">
        <button
          type="button"
          name="github"
          className="form__btn form__btn-white"
          onClick={onClickSocialLogin}
        >
          <SiGithub className="form__social-icon" /> Github로 가입하기
        </button>
      </div>
    </form>
  );
}
