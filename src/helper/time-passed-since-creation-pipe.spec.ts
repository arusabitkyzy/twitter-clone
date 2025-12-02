import { TimePassedSinceCreationPipe } from './time-passed-since-creation-pipe';

describe('TimePassedSinceCreationPipe', () => {
  it('create an instance', () => {
    const pipe = new TimePassedSinceCreationPipe();
    expect(pipe).toBeTruthy();
  });
});
