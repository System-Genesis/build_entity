// import chai, { assert } from 'chai';
// import chaiHttp from 'chai-http';

// chai.should();

// chai.use(chaiHttp);

// describe('utils', () => {
//   describe('setPhone', () => {
//     it('full home phone', () => {
//       const phone = '02-9973575';
//       const res = setPhone({ areaCode: '02', phone: '9973575' });

//       assert.equal(res, phone);
//     });

//     it('home phone', () => {
//       const phone = '2-9973575';
//       const res = setPhone({ areaCode: '2', phone: '9973575' });

//       assert.equal(res, phone);
//     });

//     it('mobile phone', () => {
//       const phone = '054-8034770';
//       const res = setPhone({ areaCode: '054', phone: '8034770' });

//       assert.notEqual(res, phone);
//     });
//   });

//   describe('setMobilePhone', () => {
//     it('full home phone', () => {
//       const phone = '02-9973575';
//       const res = setMobilePhone({ areaCode: '02', phone: '9973575' });

//       assert.notEqual(res, phone);
//     });

//     it('home phone', () => {
//       const phone = '2-9973575';
//       const res = setMobilePhone({ areaCode: '2', phone: '9973575' });

//       assert.notEqual(res, phone);
//     });

//     it('full mobile phone', () => {
//       const phone = '054-8034770';
//       const res = setMobilePhone({ areaCodeMobile: '054', mobilePhone: '8034770' });

//       assert.equal(res, phone);
//     });

//     it('mobile phone', () => {
//       const phone = '54-8034770';
//       const res = setMobilePhone({ areaCodeMobile: '54', mobilePhone: '8034770' });

//       assert.equal(res, phone);
//     });
//   });

// });
