import LoginRegisterWrapper from "@/Components/LandingComponents/atoms/LoginRegisterWrapper/LoginRegisterWrapper";
import EmailForm from "@/Components/LandingComponents/molecules/ForgotPasswordForm/EmailForm/EmailForm";
import SignupPrompt from "@/Components/LandingComponents/molecules/LoginContent/SignupPrompt/SignupPrompt";

const ForgotPasswordForm = () => {
    return (
        <LoginRegisterWrapper>
            <EmailForm/>
            <SignupPrompt/>
        </LoginRegisterWrapper>
    );
};

export default ForgotPasswordForm;
