import { Injectable } from '@angular/core';
import { ColorProgramWrapper } from './color-program-wrapper';
import { TexProgramWrapper } from './tex-program-wrapper';

@Injectable({
  providedIn: 'root'
})
export class ShaderService {
  colorProgramWrapper: ColorProgramWrapper;
  private colorVertexShaderSource = `
    attribute vec3 a_position;

    uniform mat4 u_modelViewProjection;

    void main() {
      gl_Position = u_modelViewProjection * vec4(a_position, 1.0);
    }
  `;
  private colorFragmentShaderSource = `
    precision mediump float;

    uniform vec4 u_color;

    void main() {
      gl_FragColor = u_color;
    }
  `;

  texProgramWrapper: TexProgramWrapper;
  private texVertexShaderSource = `
    attribute vec3 a_position;
    attribute vec2 a_texCoord;

    uniform mat4 u_modelViewProjection;

    varying vec2 v_texCoord;

    void main() {
        v_texCoord = a_texCoord;
        gl_Position = u_modelViewProjection * vec4(a_position, 1.0);
    }
  `;
  private texFragmentShaderSource = `
    precision mediump float;

    uniform sampler2D u_texture;

    varying vec2 v_texCoord;

    void main() {
        gl_FragColor = texture2D(u_texture, v_texCoord);
        // gl_FragColor = vec4(1, 0.5, 1, 1);
    }
  `;

  constructor() { }

  initShaders(gl: WebGLRenderingContext) {
    this.colorProgramWrapper = this.getColorProgramWrapper(gl);
    this.texProgramWrapper = this.getTexProgramWrapper(gl);
  }

  private getTexProgramWrapper(gl: WebGLRenderingContext) {
    const program = this.createProgramFromShaderSources(
      gl,
      this.texVertexShaderSource,
      this.texFragmentShaderSource
    );
    const positionAttribLocation = gl.getAttribLocation(program, 'a_position');
    const texCoordAttribLocation = gl.getAttribLocation(program, 'a_texCoord');
    const modelViewProjectionUniformLocation = gl.getUniformLocation(
      program,
      'u_modelViewProjection'
    );
    const textureUniformLocation = gl.getUniformLocation(program, 'u_texture');
    return {
      program: program,
      positionAttribLocation: positionAttribLocation,
      texCoordAttribLocation: texCoordAttribLocation,
      modelViewProjectionUniformLocation: modelViewProjectionUniformLocation,
      textureUniformLocation: textureUniformLocation
    };
  }

  private getColorProgramWrapper(gl: WebGLRenderingContext) {
    const program = this.createProgramFromShaderSources(
      gl,
      this.colorVertexShaderSource,
      this.colorFragmentShaderSource
    );
    const positionAttribLocation = gl.getAttribLocation(program, 'a_position');
    const modelViewProjectionUniformLocation = gl.getUniformLocation(
      program,
      'u_modelViewProjection'
    );
    const colorUniformLocation = gl.getUniformLocation(program, 'u_color');
    return {
      program: program,
      positionAttribLocation: positionAttribLocation,
      modelViewProjectionUniformLocation: modelViewProjectionUniformLocation,
      colorUniformLocation: colorUniformLocation
    };
  }

  private compileShader(
    gl: WebGLRenderingContext,
    shaderSource: string,
    shaderType: number
  ) {
    const shader = gl.createShader(shaderType);
    gl.shaderSource(shader, shaderSource);
    gl.compileShader(shader);
    const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (!success) {
      throw new Error('Shader failed to compile:' + gl.getShaderInfoLog(shader));
    }
    return shader;
  }

  private createProgram(
    gl: WebGLRenderingContext,
    vertexShader: WebGLShader,
    fragmentShader: WebGLShader
  ) {
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    const success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (!success) {
      throw new Error('Program failed to link:' + gl.getProgramInfoLog(program));
    }

    return program;
  }

  private createProgramFromShaderSources(
    gl: WebGLRenderingContext,
    vertexShaderSource: string,
    fragmentShaderSource: string
  ) {
    const vertexShader = this.compileShader(
      gl,
      vertexShaderSource,
      gl.VERTEX_SHADER
    );
    const fragmentShader = this.compileShader(
      gl,
      fragmentShaderSource,
      gl.FRAGMENT_SHADER
    );
    return this.createProgram(gl, vertexShader, fragmentShader);
  }
}
