import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Torus } from '@react-three/drei'; // Import Torus
import { MeshPhongMaterial } from 'three'; // Import MeshPhongMaterial

const RotatingTorus = ({ radius, color, rotationSpeedX, rotationSpeedY, oscillationSpeedX, oscillationSpeedY }) => {
  const mesh = useRef();
  const [time, setTime] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(prevTime => prevTime + 0.01);
    }, 16); // Approximately 60 FPS

    return () => clearInterval(interval);
  }, []);

  useFrame(() => {
    if (mesh.current) {
      const oscillationX = Math.sin(time * oscillationSpeedX);
      const oscillationY = Math.cos(time * oscillationSpeedY);
      mesh.current.rotation.x += rotationSpeedX * oscillationX;
      mesh.current.rotation.y += rotationSpeedY * oscillationY;
    }
  });

  return (
    <Torus ref={mesh} args={[radius, 0.2, 16, 100]} position={[0, 0, 0]}>
      <meshPhongMaterial attach="material" color={color} shininess={70} />
    </Torus>
  );
};

const ThreeScene = () => {
  const torusRadii = Array.from({ length: 12 }, (_, i) => 1 + i * 0.5); // Adjusted spacing
  const startColor = { r: 0, g: 0, b: 0 }; // Red
  const endColor = { r: 0, g: 0, b: 0 }; // Blue

  const colors = torusRadii.map((_, i) => {
    const t = i / (torusRadii.length - 1);
    return {
      r: startColor.r + (endColor.r - startColor.r) * t,
      g: startColor.g + (endColor.g - startColor.g) * t,
      b: startColor.b + (endColor.b - startColor.b) * t,
    };
  }).map(color => `rgb(${Math.round(color.r)}, ${Math.round(color.g)}, ${Math.round(color.b)})`);

  const rotationSpeedsX = Array.from({ length: 12 }, (_, i) => 0.0005 * (i + 1)); // Increasing rotation speed for x
  const rotationSpeedsY = Array.from({ length: 12 }, (_, i) => 0.0002 * (i + 1)); // Increasing rotation speed for y
  const oscillationSpeedsX = Array.from({ length: 12 }, (_, i) => 1 + i * 0.001); // Increasing oscillation speed for x
  const oscillationSpeedsY = Array.from({ length: 12 }, (_, i) => 1 + i * 0.001); // Increasing oscillation speed for y

  return (
    <Canvas camera={{ position: [0, 0, 10] }} style={{ background: 'black' }}>
      <ambientLight intensity={0.1} />
      <directionalLight
        position={[5, 5, 5]} // Key light
        intensity={30}
        color="white"
      />
      <directionalLight
        position={[-5, -5, -5]} // Fill light
        intensity={5}
        color="white"
      />
      <pointLight
        position={[0, 0, 10]} // Rim light
        intensity={10}
        color="white"
      />
      {torusRadii.map((radius, index) => (
        <RotatingTorus
          key={index}
          radius={radius}
          color={colors[index]}
          rotationSpeedX={rotationSpeedsX[index]}
          rotationSpeedY={rotationSpeedsY[index]}
          oscillationSpeedX={oscillationSpeedsX[index]}
          oscillationSpeedY={oscillationSpeedsY[index]}
        />
      ))}
      <OrbitControls />
    </Canvas>
  );
};

export default ThreeScene;
