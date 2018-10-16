import { RenderingModule } from './rendering.module';

describe('RenderingModule', () => {
  let renderingModule: RenderingModule;

  beforeEach(() => {
    renderingModule = new RenderingModule();
  });

  it('should create an instance', () => {
    expect(renderingModule).toBeTruthy();
  });
});
