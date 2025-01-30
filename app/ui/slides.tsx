import React, { useEffect, useRef, useState } from 'react';
import { Card, ListGroup, Container, Col, Row } from 'react-bootstrap';
import { supabase } from '../lib/superbase';
import Presentation from './Presentation';

const Slides = ({ user }: { user: string }) => {
  const isInserted = useRef(false);
  const [users, setUsers] = useState<string[] | []>([user]);

  useEffect(() => {
    if (!isInserted.current) {
      async function insertData(nick: string) {
        const { error } = await supabase.from('users').insert([{ nick }]);
        if (error) console.error('Insert Error:', error);
        else console.log('Inserted:', nick);
      }

      insertData(user);
      isInserted.current = true;
    }

    async function getUsers() {
      const { data, error } = await supabase.from('users').select('*');
      if (error) console.error('Read Error:', error);
      else {
        const users = data ? [...data.map((user) => user.nick)] : [];
        setUsers(() => [...users]);
      }
    }

    getUsers();
    const channel = supabase
      .channel('realtime')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'users' },
        (payload) =>
          setUsers((curentUsers) => [...curentUsers, payload.new.nick])
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  return (
    <Container className="d-flex flex-column align-items-center justify-content-center vh-100">
      <Row>
        <Col>
          <Card className="p-3 shadow-sm" style={{ width: '300px' }}>
            <Card.Body>
              <Card.Title className="text-center">Hello, {user} 👋</Card.Title>
              <Card.Subtitle className="mt-3 mb-2 text-muted">
                Connected users:
              </Card.Subtitle>

              {users.length > 0 ? (
                <ListGroup variant="flush">
                  {users.map((user, i) => (
                    <ListGroup.Item key={i}>{user}</ListGroup.Item>
                  ))}
                </ListGroup>
              ) : (
                <p className="text-muted">No users connected</p>
              )}
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Presentation />
        </Col>
      </Row>
    </Container>
  );
};

export default Slides;
