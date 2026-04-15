// THREE is loaded dynamically so a missing vendor file doesn't kill the whole module
let THREE = null;

const root = document.documentElement;
const revealTargets = new WeakSet();
const lottieAnimations = new Map();
const threeScenes = new Map();
const motionMedia = window.matchMedia('(prefers-reduced-motion: reduce)');

function shouldReduceMotion() {
  return motionMedia.matches;
}

function getMotionLibs() {
  return {
    gsap: window.gsap || null,
    ScrollTrigger: window.ScrollTrigger || null,
    lottie: window.lottie || null
  };
}

function setMotionMode() {
  const reduce = shouldReduceMotion();
  root.classList.toggle('motion-enabled', !reduce);
  root.classList.toggle('motion-reduce', reduce);
  root.dataset.motionMode = reduce ? 'reduce' : 'full';
  return reduce;
}

function revealImmediately(nodes) {
  nodes.forEach((node) => {
    node.classList.add('is-visible');
    node.style.opacity = '1';
    node.style.transform = 'none';
  });
}

function registerGsapPlugins(gsap, ScrollTrigger) {
  if (!gsap || !ScrollTrigger) {
    return false;
  }

  gsap.registerPlugin(ScrollTrigger);
  return true;
}

function initEditorialReveals({ gsap, ScrollTrigger, reduceMotion }) {
  const nodes = [...document.querySelectorAll('[data-editorial-reveal]')];

  if (!nodes.length) {
    return 0;
  }

  if (reduceMotion || !registerGsapPlugins(gsap, ScrollTrigger)) {
    revealImmediately(nodes);
    return nodes.length;
  }

  nodes.forEach((node) => {
    if (revealTargets.has(node)) {
      return;
    }

    revealTargets.add(node);

    const distance = Number(node.dataset.motionDistance || 48);
    const duration = Number(node.dataset.motionDuration || 1);
    const delay = Number(node.dataset.motionDelay || 0);
    const start = node.dataset.motionStart || 'top 85%';
    const once = node.dataset.motionOnce !== 'false';

    gsap.set(node, { autoAlpha: 0, y: distance });

    ScrollTrigger.create({
      trigger: node,
      start,
      once,
      onEnter: () => {
        node.classList.add('is-visible');
        gsap.to(node, {
          autoAlpha: 1,
          y: 0,
          duration,
          delay,
          ease: node.dataset.motionEase || 'power3.out',
          overwrite: 'auto'
        });
      },
      onLeaveBack: once
        ? undefined
        : () => {
            node.classList.remove('is-visible');
            gsap.set(node, { autoAlpha: 0, y: distance });
          }
    });
  });

  return nodes.length;
}

function initLottieBlocks({ lottie, reduceMotion }) {
  const nodes = [...document.querySelectorAll('[data-lottie-src]')];

  if (!nodes.length) {
    return 0;
  }

  nodes.forEach((node) => {
    if (lottieAnimations.has(node)) {
      return;
    }

    if (reduceMotion || !lottie) {
      node.dataset.motionState = 'reduced';
      if (node.dataset.lottiePoster) {
        node.style.backgroundImage = `url("${node.dataset.lottiePoster}")`;
      }
      return;
    }

    const animation = lottie.loadAnimation({
      container: node,
      renderer: node.dataset.lottieRenderer || 'svg',
      loop: node.dataset.lottieLoop !== 'false',
      autoplay: node.dataset.lottieAutoplay !== 'false',
      path: node.dataset.lottieSrc
    });

    lottieAnimations.set(node, animation);
    node.dataset.motionState = 'active';

    if (node.dataset.lottiePlay === 'hover') {
      animation.stop();
      node.addEventListener('mouseenter', () => animation.play());
      node.addEventListener('mouseleave', () => animation.stop());
    }
  });

  return nodes.length;
}

function mixChannel(a, b, amount) {
  return a + (b - a) * amount;
}

function buildEditorialParticles(node, scene) {
  const count = Number(node.dataset.threeCount || 72);
  const radius = Number(node.dataset.threeRadius || 2.5);
  const depth = Number(node.dataset.threeDepth || 2.2);
  const speed = Number(node.dataset.threeSpeed || 0.2);
  const size = Number(node.dataset.threeSize || 0.032);
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const phases = new Float32Array(count);
  const drift = new Float32Array(count);
  const basePositions = new Float32Array(count * 3);

  const wineColor = new THREE.Color(0x7a3141);
  const slateColor = new THREE.Color(0x274658);
  const goldColor = new THREE.Color(0xb19e73);

  for (let index = 0; index < count; index += 1) {
    const angle = Math.random() * Math.PI * 2;
    const spread = radius * (0.35 + Math.random() * 0.85);
    const x = Math.cos(angle) * spread;
    const y = (Math.random() - 0.5) * radius * 1.6;
    const z = (Math.random() - 0.5) * depth;
    const colorMix = Math.random();
    const warmMix = Math.random();
    const baseColor = slateColor.clone().lerp(wineColor, colorMix * 0.6);
    const finalColor = baseColor.lerp(goldColor, warmMix * 0.22);
    const pointIndex = index * 3;

    basePositions[pointIndex] = x;
    basePositions[pointIndex + 1] = y;
    basePositions[pointIndex + 2] = z;
    positions[pointIndex] = x;
    positions[pointIndex + 1] = y;
    positions[pointIndex + 2] = z;
    colors[pointIndex] = finalColor.r;
    colors[pointIndex + 1] = finalColor.g;
    colors[pointIndex + 2] = finalColor.b;
    phases[index] = Math.random() * Math.PI * 2;
    drift[index] = 0.2 + Math.random() * 0.75;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const material = new THREE.PointsMaterial({
    size,
    transparent: true,
    opacity: 0.42,
    vertexColors: true,
    sizeAttenuation: true,
    depthWrite: false
  });

  const points = new THREE.Points(geometry, material);
  points.rotation.z = -0.32;
  points.rotation.x = -0.08;
  scene.add(points);

  return {
    mesh: points,
    update(elapsed) {
      const position = geometry.attributes.position;

      for (let index = 0; index < count; index += 1) {
        const pointIndex = index * 3;
        const phase = phases[index];
        const pace = elapsed * speed * drift[index];
        position.array[pointIndex] = basePositions[pointIndex] + Math.sin(pace + phase) * 0.06;
        position.array[pointIndex + 1] = basePositions[pointIndex + 1] + Math.cos(pace * 0.9 + phase) * 0.08;
        position.array[pointIndex + 2] = basePositions[pointIndex + 2] + Math.sin(pace * 0.55 + phase) * 0.1;
      }

      position.needsUpdate = true;
      points.rotation.z += 0.00035 * speed;
      points.rotation.y = mixChannel(points.rotation.y, 0.14, 0.004);
    }
  };
}

function resizeThreeScene(instance) {
  const { renderer, camera, container } = instance;
  const width = container.clientWidth || 1;
  const height = container.clientHeight || Math.max(Math.round(width * 0.65), 1);

  if (width === instance.width && height === instance.height) {
    return;
  }

  instance.width = width;
  instance.height = height;
  renderer.setSize(width, height, false);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
}

function renderThreeScene(instance) {
  const { renderer, scene, camera, mesh, container, update } = instance;
  resizeThreeScene(instance);

  if (!container.isConnected) {
    return;
  }

  if (typeof update === 'function') {
    update(window.performance.now() * 0.001);
  } else if (mesh) {
    mesh.rotation.x += 0.0018;
    mesh.rotation.y += 0.0022;
  }

  renderer.render(scene, camera);
}

function startThreeSceneLoop(instance) {
  const tick = () => {
    if (shouldReduceMotion()) {
      instance.frame = null;
      return;
    }

    renderThreeScene(instance);
    instance.frame = window.requestAnimationFrame(tick);
  };

  renderThreeScene(instance);
  instance.frame = window.requestAnimationFrame(tick);
}

function initThreeCanvases({ reduceMotion }) {
  const nodes = [...document.querySelectorAll('[data-three-scene]')];

  if (!nodes.length) {
    return 0;
  }

  // Lazily load THREE so a missing vendor file doesn't break the rest of the module
  const threeReady = THREE
    ? Promise.resolve(THREE)
    : import('./vendor/three.module.min.js')
        .then((mod) => { THREE = mod; return mod; })
        .catch(() => null);

  threeReady.then((mod) => {
    if (!mod) return; // Three.js unavailable — skip particle canvases silently

  nodes.forEach((node) => {
    if (threeScenes.has(node)) {
      return;
    }

    if (reduceMotion) {
      node.dataset.motionState = 'reduced';
      return;
    }

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.domElement.className = 'editorial-motion-canvas';
    node.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
    camera.position.set(0, 0, 5);

    const ambient = new THREE.AmbientLight(0xf5ecdc, 0.8);
    const point = new THREE.PointLight(0xb19e73, 0.55, 18);
    point.position.set(2.8, 1.6, 6);
    const fill = new THREE.PointLight(0x274658, 0.24, 16);
    fill.position.set(-3.2, -1.6, 5.5);
    scene.add(ambient, point, fill);

    const mode = node.dataset.threeMode || 'default';
    let mesh;
    let update;

    if (mode === 'editorial-particles') {
      const particleField = buildEditorialParticles(node, scene);
      mesh = particleField.mesh;
      update = particleField.update;
    } else {
      const geometry = new THREE.IcosahedronGeometry(1.1, 1);
      const material = new THREE.MeshPhysicalMaterial({
        color: 0x7a1f33,
        metalness: 0.12,
        roughness: 0.42,
        wireframe: node.dataset.threeWireframe === 'true',
        transparent: true,
        opacity: 0.6
      });

      mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);
    }

    const instance = { renderer, scene, camera, mesh, update, container: node, frame: null, width: 0, height: 0 };
    threeScenes.set(node, instance);
    node.dataset.motionState = 'active';
    startThreeSceneLoop(instance);
  });

  }); // end threeReady.then

  return nodes.length;
}

function syncReducedMotion() {
  const reduceMotion = setMotionMode();

  if (reduceMotion) {
    revealImmediately([...document.querySelectorAll('[data-editorial-reveal]')]);

    lottieAnimations.forEach((animation, node) => {
      animation.stop();
      node.dataset.motionState = 'reduced';
    });

    threeScenes.forEach((instance, node) => {
      if (instance.frame) {
        window.cancelAnimationFrame(instance.frame);
        instance.frame = null;
      }
      node.dataset.motionState = 'reduced';
      renderThreeScene(instance);
    });

    return;
  }

  lottieAnimations.forEach((animation, node) => {
    node.dataset.motionState = 'active';
    if (node.dataset.lottiePlay !== 'hover') {
      animation.play();
    }
  });

  threeScenes.forEach((instance, node) => {
    if (!instance.frame) {
      node.dataset.motionState = 'active';
      startThreeSceneLoop(instance);
    }
  });

  initEditorialMotion();
}

function initEditorialMotion() {
  const reduceMotion = setMotionMode();
  const libs = getMotionLibs();

  return {
    reduceMotion,
    reveals: initEditorialReveals({ ...libs, reduceMotion }),
    lotties: initLottieBlocks({ ...libs, reduceMotion }),
    threeScenes: initThreeCanvases({ reduceMotion }),
    THREE
  };
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initEditorialMotion, { once: true });
} else {
  initEditorialMotion();
}

if (typeof motionMedia.addEventListener === 'function') {
  motionMedia.addEventListener('change', syncReducedMotion);
} else if (typeof motionMedia.addListener === 'function') {
  motionMedia.addListener(syncReducedMotion);
}

window.SevenPyramidEditorialMotion = {
  init: initEditorialMotion,
  refreshReducedMotion: syncReducedMotion,
  shouldReduceMotion,
  get THREE() { return THREE; }
};
