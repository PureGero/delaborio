import { useContext, useEffect, useRef } from "react";
import { GameContext } from "../GameContext";
import * as THREE from 'three';

export default function Renderer() {
  const game = useContext(GameContext);
  const canvasRef = useRef(null) as React.MutableRefObject<HTMLCanvasElement | null>;

  useEffect(() => {
    if (canvasRef.current == null) return;

    let keepRendering = true;

    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current });

    const onResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(window.devicePixelRatio);
      game.scene.camera.aspect = window.innerWidth / window.innerHeight;
      game.scene.camera.updateProjectionMatrix();
    }
    window.addEventListener('resize', onResize);
    onResize();

    const onKeyDown = (event: KeyboardEvent) => {
      game.keysDown.add(event.keyCode);
    };
    window.addEventListener('keydown', onKeyDown);

    const onKeyUp = (event: KeyboardEvent) => {
      game.keysDown.delete(event.keyCode);
    };
    window.addEventListener('keyup', onKeyUp);

    const render = () => {
      if (!keepRendering) return;
      window.requestAnimationFrame(render);
      game.tick();
      renderer.render(game.scene.scene, game.scene.camera);
    }
    render();

    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      keepRendering = false;
    }
  });

  return (
    <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full" />
  )
}