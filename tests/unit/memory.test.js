const {
  writeFragment,
  readFragment,
  writeFragmentData,
  readFragmentData,
} = require('../../src/model/data/memory');

describe('MemoryDB', () => {
  test('writeFragment() should not returns anything', async () => {
    const result = await writeFragment({ ownerId: 'a123', id: 'b1', fragment: 'test1' });
    expect(result).toBe(undefined);
  });

  test('readFragment() returns return what was saved using writeFragment() into the db', async () => {
    const data = { ownerId: 'a123', id: 'b1', fragment: 'test2' };
    await writeFragment(data);
    const result = await readFragment('a123', 'b1');
    expect(result).toBe(data);
  });

  test('writeFragmentData() should not return anything', async () => {
    const result = await writeFragmentData('a123', 'b1', 'test3');
    expect(result).toBe(undefined);
  });

  test('readFragmentData() should return what was saved using writeFragmentData() into the db', async () => {
    const data = 'test4';
    await writeFragmentData('a123', 'b1', data);
    const result = await readFragmentData('a123', 'b1');
    expect(result).toBe(data);
  });
});
