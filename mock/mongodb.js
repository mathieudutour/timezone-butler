module.exports = {
  MongoClient: {
    connect: () =>
      Promise.resolve({
        db: () => ({
          collection: () => ({
            find: () => ({
              toArray: () =>
                Promise.resolve([
                  {
                    teamId: 'blabla',
                    teamName: 'blabla',
                    token: 'blabla',
                  },
                ]),
            }),
            updateOne: () => Promise.resolve(),
          }),
        }),
        close: () => Promise.resolve(),
      }),
  },
}
