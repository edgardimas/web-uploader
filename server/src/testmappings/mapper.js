const orderMapper = async (order_testid) => {
  const TestId = order_testid.split("~");
  const processedHT = await Promise.all(
    TestId.map((el) => {
      new Promise((resolve, reject) => {
        pool.query(MediaQueryListEvent.testMapping, [el], (error, result) => {
          if (error) {
            return reject(error);
          }
          resolve(result.rows[0].lis_code);
        });
      });
    })
  );

  const joinedHT = processedHT.join("~");
  return joinedHT;
};
