import { useNavigate } from 'react-router-dom';

function Welcome() {
    const navigate = useNavigate();

    const handleRedirect = () => {
        navigate('/Auth');
    };

    return (
        <>
            Welcome to my application!
            <button onClick={handleRedirect}>Go to Auth Page</button>
        </>
    );
}

export default Welcome;