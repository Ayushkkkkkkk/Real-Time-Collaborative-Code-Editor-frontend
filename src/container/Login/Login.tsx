import axios from 'axios';
import React, { useState } from 'react';
import styled from 'styled-components';

interface LoginPageProps {
    onLogin: () => void;
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f0f2f5;
`;

const FormWrapper = styled.div`
  background: #fff;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
`;

const Title = styled.h2`
  margin-bottom: 1.5rem;
  color: #333;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  margin: 0.5rem 0;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
`;

const Button = styled.button`
  width: 100%;
  padding: 0.75rem;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #0056b3;
  }
`;

const ErrorText = styled.p`
  color: #ff4d4f;
  font-size: 0.875rem;
`;

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [responseName, setResponseName] = useState<string>();
    const [responseEmail, setResponseEmail] = useState<string>();
    const [responsePassword, setResponsePassword] = useState<string>();

    const getInfo = async (email: string) => {
        try {
            if (email) {
                const response = await axios.get(`http://localhost:4000/api/v1/user/${email}`);
                return response.data.user;
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const information = await getInfo(email); // Wait for getInfo to finish before continuing

        if (email === information.email) {
            onLogin();
        } else {
            console.log(email);
            console.log(password);
            console.log("This is response: " + responseEmail);
            console.log("Wrong password");
            setError('Incorrect email or password');
        }
    };

    return (
        <Container>
            <FormWrapper>
                <Title>Login</Title>
                <form onSubmit={handleSubmit}>
                    <div>
                        <Input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <Input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    {error && <ErrorText>{error}</ErrorText>}
                    <Button type="submit">Login</Button>
                </form>
            </FormWrapper>
        </Container>
    );
};

export default LoginPage;

