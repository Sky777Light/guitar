import { GuitarPage } from './app.po';

describe('guitar App', function() {
  let page: GuitarPage;

  beforeEach(() => {
    page = new GuitarPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
