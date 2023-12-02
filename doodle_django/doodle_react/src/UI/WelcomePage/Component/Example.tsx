import React, { useRef } from 'react';

const Example: React.FC = () => {
  const component1Ref = useRef<HTMLDivElement>(null);
  return (
    <div ref={component1Ref}   id="ciao" 
    style={{ backgroundColor: 'white',display: 'flex', height: '100vh', width: '100%', alignItems: 'center', justifyContent: 'center' }}>
      <h1 id= "ciao">Ciao</h1>
    </div>
  );
};

export default Example;
