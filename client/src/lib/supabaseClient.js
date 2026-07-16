// MOCKED FOR SCREENSHOTS & UI DEV
const mockPromise = (data = []) => {
  let isSingle = false;
  const self = {
    eq: () => self,
    select: () => self,
    single: () => {
      isSingle = true;
      return self;
    },
    order: () => self,
    limit: () => self,
    insert: () => self,
    update: () => self,
    delete: () => self,
    then: (onRes) => {
      const resolvedData = isSingle && Array.isArray(data) ? data[0] : data;
      return Promise.resolve({ data: resolvedData, error: null }).then(onRes);
    },
    catch: (onErr) => {
      const resolvedData = isSingle && Array.isArray(data) ? data[0] : data;
      return Promise.resolve({ data: resolvedData, error: null }).catch(onErr);
    }
  };
  return self;
};

export const supabase = {
  auth: {
    getSession: async () => ({ data: { session: { user: { id: 'mock-user', email: 'test@dara.com' } } }, error: null }),
    onAuthStateChange: (cb) => {
      cb('SIGNED_IN', { user: { id: 'mock-user', email: 'test@dara.com' } });
      return { data: { subscription: { unsubscribe: () => {} } } };
    },
    signInWithPassword: async () => ({ data: { user: {} }, error: null }),
    signInWithOAuth: async ({ options }) => {
      if (options?.redirectTo) {
        window.location.href = options.redirectTo;
      }
      return { data: {}, error: null };
    },
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
    select: () => mockPromise(table === 'profiles' ? [{ id: 'mock-user', full_name: 'Mock Client', role: 'client' }] : []),
    insert: () => mockPromise({}),
    update: () => mockPromise({}),
  })
};

export default supabase;
