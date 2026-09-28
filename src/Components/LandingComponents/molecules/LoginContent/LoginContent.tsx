import LoginRegisterWrapper from "@/Components/LandingComponents/atoms/LoginRegisterWrapper/LoginRegisterWrapper";
import LoginHeader from "@/Components/LandingComponents/molecules/LoginContent/LoginHeader/LoginHeader";
import LoginForm from "@/Components/LandingComponents/molecules/LoginContent/LoginForm/LoginForm";

const LoginContent = () => {
    return (
        <LoginRegisterWrapper>
            <LoginHeader/>
            <LoginForm/>
        </LoginRegisterWrapper>
    );
};

export default LoginContent;
