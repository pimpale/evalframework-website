import React from "react";
import { genPlane } from '../utils/uvplane';
import { quat, vec2 } from 'gl-matrix';
import { TrackballCamera, } from '../utils/camera';
import { createShader, createProgram, createTexture, overwriteTexture } from '../utils/webgl';
import { colorScheme } from "../utils/colorscheme";
import { VisibilityChecker } from "../utils/visibility";
import chroma from "chroma-js";

import { Arrow90degDown, Arrow90degUp } from 'react-bootstrap-icons';

type SingularityDemoProps = {
    style?: React.CSSProperties,
    className?: string,
    width: number,
    height: number,
    runInBackground?: boolean
}

const gruvboxTheme = colorScheme();

const torus_vs = `#version 300 es
layout(location=0) in vec3 a_position;
layout(location=1) in vec3 a_color;
layout(location=2) in vec2 a_barycenter;

uniform float u_lerpAlpha;
uniform mat4 u_worldViewProjection;

out vec3 v_color;
out vec2 v_barycenter;

void main() {
   vec3 oldpos = a_position;
   vec3 newpos = oldpos/length(oldpos);

   vec3 lerpedPos = mix(oldpos, newpos, u_lerpAlpha)*0.9;

   v_color = a_color;
   v_barycenter = a_barycenter;
   gl_Position = u_worldViewProjection * vec4(lerpedPos, 1.0);
}
`;

const torus_fs = `#version 300 es
precision highp float;

in vec3 v_color;
in vec2 v_barycenter;

out vec4 v_outColor;

float gridFactor (vec2 vBC, float width) {
  vec3 bary = vec3(vBC.x, vBC.y, 1.0 - vBC.x - vBC.y);
  vec3 d = fwidth(bary);
  vec3 a3 = smoothstep(d * (width - 0.5), d * (width + 0.5), bary);
  return min(min(a3.x, a3.y), a3.z);
}

void main() {
  float alpha = 1.0-gridFactor(v_barycenter, 1.0);
  v_outColor  = vec4(v_color, alpha);
}
`;

function getBarycenter(i: number) {
    let barycenter;
    switch (i % 3) {
        case 0:
            barycenter = [0, 0];
            break;
        case 1:
            barycenter = [0, 1];
            break;
        default:
            barycenter = [1, 0];
            break;
    }
    return barycenter;
}


const topcolor = chroma(gruvboxTheme.blue).gl().slice(0, 3);
const bottomcolor = chroma(gruvboxTheme.red).gl().slice(0, 3);
const leftcolor = chroma(gruvboxTheme.green).gl().slice(0, 3);
const rightcolor = chroma(gruvboxTheme.purple).gl().slice(0, 3);
const frontcolor = chroma(gruvboxTheme.yellow).gl().slice(0, 3);
const backcolor = chroma(gruvboxTheme.teal).gl().slice(0, 3);

function genColoredUnitCube(n_divisions: number = 3) {
    return [
        // top level
        ...genPlane(n_divisions, n_divisions).flatMap((v, i) => [v[0], 0, v[1], ...topcolor, ...getBarycenter(i % 3)]),
        // bottomlevel
        ...genPlane(n_divisions, n_divisions).flatMap((v, i) => [v[0], 1, v[1], ...bottomcolor, ...getBarycenter(i % 3)]),
        // left level
        ...genPlane(n_divisions, n_divisions).flatMap((v, i) => [0, v[0], v[1], ...leftcolor, ...getBarycenter(i % 3)]),
        // right level
        ...genPlane(n_divisions, n_divisions).flatMap((v, i) => [1, v[0], v[1], ...rightcolor, ...getBarycenter(i % 3)]),
        // front level
        ...genPlane(n_divisions, n_divisions).flatMap((v, i) => [v[0], v[1], 0, ...frontcolor, ...getBarycenter(i % 3)]),
        // back level
        ...genPlane(n_divisions, n_divisions).flatMap((v, i) => [v[0], v[1], 1, ...backcolor, ...getBarycenter(i % 3)]),
    ];
}

function genColoredUnitPrismX(stretch_x: number, n_divisions = 3) {
    // Calculate stretched divisions proportionally, rounding up
    const x_divisions = Math.ceil(n_divisions * stretch_x);

    return [
        // top level (y=0)
        ...genPlane(x_divisions, n_divisions).flatMap((v, i) => [v[0] * stretch_x, 0, v[1], ...topcolor, ...getBarycenter(i % 3)]),
        // bottom level (y=1)
        ...genPlane(x_divisions, n_divisions).flatMap((v, i) => [v[0] * stretch_x, 1, v[1], ...bottomcolor, ...getBarycenter(i % 3)]),
        // left level (x=0)
        ...genPlane(n_divisions, n_divisions).flatMap((v, i) => [0, v[0], v[1], ...leftcolor, ...getBarycenter(i % 3)]),
        // right level (x=stretch_x)
        ...genPlane(n_divisions, n_divisions).flatMap((v, i) => [stretch_x, v[0], v[1], ...rightcolor, ...getBarycenter(i % 3)]),
        // front level (z=0)
        ...genPlane(x_divisions, n_divisions).flatMap((v, i) => [v[0] * stretch_x, v[1], 0, ...frontcolor, ...getBarycenter(i % 3)]),
        // back level (z=1)
        ...genPlane(x_divisions, n_divisions).flatMap((v, i) => [v[0] * stretch_x, v[1], 1, ...backcolor, ...getBarycenter(i % 3)]),
    ];
}


function genColoredTwistedPrismX(stretch_x: number, n_divisions = 3, n_twists = 1) {
    const x_divisions = Math.ceil(n_divisions * stretch_x);

    const twistPoint = (x: number, y: number, z: number) => {
        // Adjust x to be centered around 0
        const centered_x = x - stretch_x / 2;
        const angle = (x / stretch_x) * Math.PI * 2 * n_twists;
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        // y and z are in [0,1], center them to [-0.5,0.5]
        const centered_y = y - 0.5;
        const centered_z = z - 0.5;
        // Apply rotation to centered coordinates
        const new_y = centered_y * cos - centered_z * sin;
        const new_z = centered_y * sin + centered_z * cos;
        return [centered_x, new_y, new_z];
    };

    return [
        // top level (y=-0.5)
        ...genPlane(x_divisions, n_divisions).flatMap((v, i) => {
            const [x, y, z] = twistPoint(v[0] * stretch_x, 0, v[1]);
            return [x, y, z, ...topcolor, ...getBarycenter(i % 3)];
        }),
        // bottom level (y=0.5)
        ...genPlane(x_divisions, n_divisions).flatMap((v, i) => {
            const [x, y, z] = twistPoint(v[0] * stretch_x, 1, v[1]);
            return [x, y, z, ...bottomcolor, ...getBarycenter(i % 3)];
        }),
        // left level (x=-stretch_x/2)
        ...genPlane(n_divisions, n_divisions).flatMap((v, i) => {
            const [x, y, z] = twistPoint(0, v[0], v[1]);
            return [x, y, z, ...leftcolor, ...getBarycenter(i % 3)];
        }),
        // right level (x=stretch_x/2)
        ...genPlane(n_divisions, n_divisions).flatMap((v, i) => {
            const [x, y, z] = twistPoint(stretch_x, v[0], v[1]);
            return [x, y, z, ...rightcolor, ...getBarycenter(i % 3)];
        }),
        // front level (z=-0.5)
        ...genPlane(x_divisions, n_divisions).flatMap((v, i) => {
            const [x, y, z] = twistPoint(v[0] * stretch_x, v[1], 0);
            return [x, y, z, ...frontcolor, ...getBarycenter(i % 3)];
        }),
        // back level (z=0.5)
        ...genPlane(x_divisions, n_divisions).flatMap((v, i) => {
            const [x, y, z] = twistPoint(v[0] * stretch_x, v[1], 1);
            return [x, y, z, ...backcolor, ...getBarycenter(i % 3)];
        }),
    ];
}


type Point = {
    x: number,
    y: number
}

class SingularityDemo extends React.Component<SingularityDemoProps, {}> {

    // this is the ref that three js uses
    private canvas = React.createRef<HTMLCanvasElement>();

    // the torus vertexes
    private readonly vertexes!: vec2[];

    private gl!: WebGL2RenderingContext;

    private camera!: TrackballCamera;
    private vis!: VisibilityChecker;

    private torusWorldViewProjectionLoc!: WebGLUniformLocation;
    private torusLerpAlpha!: WebGLUniformLocation;

    private filledbuffer!: WebGLBuffer;
    private nTriangles!: number;

    private requestID!: number;

    constructor(props: SingularityDemoProps) {
        super(props);
    }

    componentDidMount() {
        // init camera
        this.camera = new TrackballCamera(this.canvas.current!, { lock_x: true, rotation: quat.fromEuler(quat.create(), 0.1, 0.0, 0.0) });
        this.vis = new VisibilityChecker(this.canvas.current!);

        // get webgl
        this.gl = this.canvas.current!.getContext('webgl2')!;
        this.gl.enable(this.gl.DEPTH_TEST);

        const program = createProgram(
            this.gl,
            [
                createShader(this.gl, this.gl.VERTEX_SHADER, torus_vs),
                createShader(this.gl, this.gl.FRAGMENT_SHADER, torus_fs),
            ]
        )!;

        const positionLoc = this.gl.getAttribLocation(program, 'a_position');
        const colorLoc = this.gl.getAttribLocation(program, 'a_color');
        const barycenterLoc = this.gl.getAttribLocation(program, 'a_barycenter');

        this.torusLerpAlpha = this.gl.getUniformLocation(program, "u_lerpAlpha")!;
        this.torusWorldViewProjectionLoc = this.gl.getUniformLocation(program, "u_worldViewProjection")!;


        // map different buffers
        let filled = genColoredTwistedPrismX(50.0, 3, 1); // for example, to create 2 full twists
        this.nTriangles = filled.length / 8;

        this.filledbuffer = this.gl.createBuffer()!;
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.filledbuffer);
        this.gl.bufferData(
            this.gl.ARRAY_BUFFER,
            new Float32Array(filled),
            this.gl.STATIC_DRAW
        );

        // setup our attributes to tell WebGL how to pull
        // the data from the buffer above to the position attribute
        this.gl.enableVertexAttribArray(positionLoc);
        this.gl.vertexAttribPointer(
            positionLoc,
            3,              // size (num components)
            this.gl.FLOAT,  // type of data in buffer
            false,          // normalize
            8 * 4,            // stride (0 = auto)
            0,              // offset
        );
        this.gl.enableVertexAttribArray(colorLoc);
        this.gl.vertexAttribPointer(
            colorLoc,
            3,              // size (num components)
            this.gl.FLOAT,  // type of data in buffer
            false,          // normalize
            8 * 4,            // stride (0 = auto)
            3 * 4,            // offset
        );
        this.gl.enableVertexAttribArray(barycenterLoc);
        this.gl.vertexAttribPointer(
            barycenterLoc,
            2,              // size (num components)
            this.gl.FLOAT,  // type of data in buffer
            false,          // normalize
            8 * 4,            // stride (0 = auto)
            6 * 4,            // offset
        );

        this.gl.useProgram(program);

        // set defaults
        this.gl.uniform1f(this.torusLerpAlpha, 0.0);

        // start animation loop
        this.animationLoop();

    }


    componentWillUnmount() {
        window.cancelAnimationFrame(this.requestID!);
        this.camera.cleanup();
        this.vis.cleanup();
    }

    handleCircularityChange = () => {
        // how much to lerp towards circle
        const lerpAlpha = this.lerpRange.current!.valueAsNumber;
        this.gl.uniform1f(this.torusLerpAlpha, lerpAlpha);
    }

    animationLoop = () => {
        this.camera.update();

        // exit early if not on screen (don't lag the computer)
        if (!this.vis.isVisible() && this.props.runInBackground !== true) {
            this.requestID = window.requestAnimationFrame(this.animationLoop);
            return;
        }


        {
            // set uniform
            const worldViewProjectionMat = this.camera.getTrackballCameraMatrix(this.props.width, this.props.height);
            this.gl.uniformMatrix4fv(this.torusWorldViewProjectionLoc, false, worldViewProjectionMat);

            // draw triangles
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.filledbuffer);
            this.gl.drawArrays(this.gl.TRIANGLES, 0, this.nTriangles);
        }

        this.requestID = window.requestAnimationFrame(this.animationLoop);
    };

    render() {
        return <canvas
            ref={this.canvas}
            height={this.props.height}
            width={this.props.width}
            className={this.props.className}
        />
    }
}

export default SingularityDemo;
