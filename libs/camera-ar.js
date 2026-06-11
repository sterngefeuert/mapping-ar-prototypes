// camera-ar.js — markerless, camera-backed "AR" for iOS Safari (and any phone).
//
// Why this exists: iOS Safari has no WebXR immersive-ar, and the XR Browser app's
// WebXR camera passthrough is unreliable. This path needs NEITHER: it puts the live
// rear camera behind the scene via getUserMedia and drives the view with the device
// gyro (DeviceOrientation). 3-DOF only — you look around by rotating the phone; there
// is no positional/world tracking and no hit-test. Good enough for framed
// screenshots/screencasts of content over the real camera. Needs HTTPS + a tap.
import * as THREE from 'three';

export function setupCameraAR({ renderer, scene, camera, controls, button, getContent, onEnter, onExit }) {
  const video = document.createElement('video');
  video.playsInline = true; video.muted = true; video.setAttribute('playsinline', '');
  Object.assign(video.style, { position: 'fixed', inset: '0', width: '100%', height: '100%',
    objectFit: 'cover', zIndex: '-1', display: 'none', background: '#000' });
  document.body.appendChild(video);

  // DeviceOrientation -> camera quaternion (standard three.js DeviceOrientationControls math)
  const zee = new THREE.Vector3(0, 0, 1);
  const euler = new THREE.Euler();
  const q0 = new THREE.Quaternion();
  const q1 = new THREE.Quaternion(-Math.sqrt(0.5), 0, 0, Math.sqrt(0.5)); // -PI/2 around X
  let dev = null, qRefInv = null, content = null, active = false;

  function absQuat() {
    const a = THREE.MathUtils.degToRad(dev.alpha || 0);
    const b = THREE.MathUtils.degToRad(dev.beta  || 0);
    const g = THREE.MathUtils.degToRad(dev.gamma || 0);
    const o = THREE.MathUtils.degToRad((screen.orientation && screen.orientation.angle) || window.orientation || 0);
    euler.set(b, a, -g, 'YXZ');
    const q = new THREE.Quaternion().setFromEuler(euler);
    q.multiply(q1);
    q.multiply(q0.setFromAxisAngle(zee, -o));
    return q;
  }
  function onOrient(e) { if (e.alpha !== null) dev = e; }

  function update() {
    if (!active || !dev) return;
    const q = absQuat();
    if (!qRefInv) qRefInv = q.clone().invert();   // first reading = "straight ahead" (where content sits)
    camera.quaternion.copy(qRefInv).multiply(q);
  }

  async function start() {
    if (window.DeviceOrientationEvent && typeof DeviceOrientationEvent.requestPermission === 'function') {
      try { await DeviceOrientationEvent.requestPermission(); } catch {}
    }
    let stream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: 'environment' } }, audio: false });
    } catch (err) {
      alert('Camera unavailable: ' + (err && err.message ? err.message : err) + '\nNeeds HTTPS and camera permission.');
      return;
    }
    video.srcObject = stream;
    try { await video.play(); } catch {}

    active = true; qRefInv = null; dev = null;
    video.style.display = 'block';
    document.documentElement.style.background = document.body.style.background = 'transparent';
    renderer.setClearColor(0x000000, 0);
    if (controls) controls.enabled = false;
    camera.position.set(0, 0, 0);

    content = getContent();
    content.position.set(0, -1.1, -2.6);          // in front of the start view; pinch/drag to reframe
    scene.add(content);

    window.addEventListener('deviceorientation', onOrient, true);
    if (button) button.textContent = '✕ exit camera';
    onEnter && onEnter(content);
  }

  function stop() {
    active = false;
    video.style.display = 'none';
    if (video.srcObject) { video.srcObject.getTracks().forEach(t => t.stop()); video.srcObject = null; }
    window.removeEventListener('deviceorientation', onOrient, true);
    if (content) {
      content.traverse(o => { if (o.isAudio && o.isPlaying) { try { o.stop(); } catch {} } });
      scene.remove(content); content = null;
    }
    document.documentElement.style.background = document.body.style.background = '';
    if (button) button.textContent = '📷 Camera AR';
    onExit && onExit();
  }

  if (button) button.addEventListener('click', () => (active ? stop() : start()));

  return { update, get active() { return active; }, get content() { return content; }, start, stop };
}
