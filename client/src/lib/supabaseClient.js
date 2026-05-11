// MOCKED FOR SCREENSHOTS
const mockPromise = (data = []) => {
  const p = Promise.resolve({ data, error: null });
  const chain = () => p;
  p.eq = chain;
  p.select = chain;
  p.single = chain;
  p.order = chain;
  p.limit = chain;
  p.insert = chain;
  p.update = chain;
  p.delete = chain;
  p.then = (onRes) => Promise.resolve({ data, error: null }).then(onRes);
  p.catch = (onErr) => Promise.resolve({ data, error: null }).catch(onErr);
  return p;
};

export const supabase = {
  auth: {
    getSession: async () => ({ data: { session: { user: { id: 'mock-user', email: 'test@dara.com' } } }, error: null }),
    onAuthStateChange: (cb) => {
      cb('SIGNED_IN', { user: { id: 'mock-user', email: 'test@dara.com' } });
      return { data: { subscription: { unsubscribe: () => {} } } };
    },
    signInWithPassword: async () => ({ data: { user: {} }, error: null }),
    signInWithOAuth: async () => ({ data: {}, error: null }),
    signOut: async () => ({ error: null }),
    getUser: async () => ({ data: { user: { id: 'mock-user', email: 'test@dara.com' } } }),
  },
  storage: {
    from: () => ({
      createSignedUrl: async () => ({ data: { signedUrl: '#' }, error: null }),
      upload: async () => ({ data: {}, error: null }),
      download: async () => ({ data: new Blob(), error: null }),
    })
  },
  channel: () => ({
    subscribe: () => ({ unsubscribe: () => {} }),
    on: function() { return this; },
  }),
  removeChannel: () => {},
  from: (table) => ({
    select: () => mockPromise(table === 'profiles' ? [{ id: 'mock-user', full_name: 'Mock User', role: 'admin' }] : []),
    insert: () => mockPromise({}),
    update: () => mockPromise({}),
  })
};

export default supabase;
