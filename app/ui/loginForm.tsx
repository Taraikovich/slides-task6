'use client';
import { Form, Button, Container } from 'react-bootstrap';

const LoginForm = ({
  onSubmit,
}: {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}) => {
  return (
    <Container className="d-flex flex-column align-items-center justify-content-center vh-100">
      <Form
        onSubmit={onSubmit}
        className="p-4 border rounded shadow bg-light"
        style={{ width: '300px' }}
      >
        <Form.Group>
          <Form.Label>Enter your name:</Form.Label>
          <Form.Control
            type="text"
            name="username"
            placeholder="Enter your name"
            required
          />
        </Form.Group>

        <Button type="submit" variant="primary" className="w-100 mt-3">
          Submit
        </Button>
      </Form>
    </Container>
  );
};

export default LoginForm;
