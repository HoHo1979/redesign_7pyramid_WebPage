const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');

const vendorFiles = [
  {
    source: path.join(rootDir, 'node_modules/lottie-web/build/player/lottie.min.js'),
    destination: path.join(rootDir, 'deploy/js/vendor/lottie.min.js')
  },
  {
    source: path.join(rootDir, 'node_modules/gsap/dist/gsap.min.js'),
    destination: path.join(rootDir, 'deploy/js/vendor/gsap.min.js')
  },
  {
    source: path.join(rootDir, 'node_modules/gsap/dist/ScrollTrigger.min.js'),
    destination: path.join(rootDir, 'deploy/js/vendor/ScrollTrigger.min.js')
  },
  {
    source: path.join(rootDir, 'node_modules/three/build/three.module.min.js'),
    destination: path.join(rootDir, 'deploy/js/vendor/three.module.min.js')
  }
];

vendorFiles.forEach(({ source, destination }) => {
  if (!fs.existsSync(source)) {
    throw new Error(`Missing vendor source: ${path.relative(rootDir, source)}`);
  }

  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.copyFileSync(source, destination);
});

console.log(
  `Synced motion vendor assets:\n${vendorFiles
    .map(({ destination }) => `- ${path.relative(rootDir, destination)}`)
    .join('\n')}`
);
