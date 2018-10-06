import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ShaderService {
  texProgramWrapper: Object;
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
    this.texProgramWrapper = this.getTexProgramWrapper(gl);
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
      throw "Shader failed to compile:" + gl.getShaderInfoLog(shader);
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
      throw ("Program failed to link:" + gl.getProgramInfoLog(program));
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
}
