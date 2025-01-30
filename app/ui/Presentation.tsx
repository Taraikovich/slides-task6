import React, { useEffect, useRef, useState } from 'react';
import { supabase } from '../lib/superbase';
import { Button, Container } from 'react-bootstrap';

const Presentation = () => {
  const isInserted = useRef(true);
  const [currentSlide, setCurrentSlide] = useState(1);

  useEffect(() => {
    if (!isInserted.current) {
      async function updateData(current_slide: number) {
        const { data, error } = await supabase
          .from('slides')
          .update({ current_slide: current_slide })
          .eq('id', 1)
          .select();
        if (error) console.error('Insert Error:', error);
        else console.log('Inserted:', data);
      }

      updateData(currentSlide);
      isInserted.current = true;
    }

    const channel = supabase
      .channel('realtime')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'slides' },
        (payload) => setCurrentSlide(payload.new.current_slide)
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentSlide]);

  useEffect(() => {
    async function getCurrentSlide() {
      const { data: currSlide, error } = await supabase
        .from('slides')
        .select('*')
        .eq('id', 1);
      if (error) console.error('Read Error:', error);
      else setCurrentSlide(currSlide[0].current_slide);
    }

    getCurrentSlide();
  }, []);

  return (
    <Container className="d-flex flex-column align-items-center vh-100">
      <div
        className="d-flex align-items-center justify-content-center border rounded bg-light"
        style={{ width: '300px', height: '360px', fontSize: '2rem' }}
      >
        Slide #{currentSlide}
      </div>

      <div className="d-flex gap-3 mt-3">
        <Button
          variant="primary"
          onClick={() => {
            setCurrentSlide((prev) => prev - 1);
            isInserted.current = false;
          }}
        >
          Prev
        </Button>

        <Button
          variant="success"
          onClick={() => {
            setCurrentSlide((prev) => prev + 1);
            isInserted.current = false;
          }}
        >
          Next
        </Button>
      </div>
    </Container>
  );
};

export default Presentation;
