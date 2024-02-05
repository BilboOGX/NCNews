Welcome to my Northcoders News API! Click the link to test its functionality and view the available endpoints --> https://ncnews-mcpn.onrender.com/api

Backend:
Installed Node Packages (NPM) 
├── jest-extended@2.0.0 
├── jest-sorted@1.0.14
├── jest@27.5.1
    dotenv@16.0.3 
├── express@4.18.2
├── husky@8.0.2
├── 
├── pg-format@1.0.4
├── pg@8.8.0
└── supertest@6.3.4

Test Driven Development (TDD) done with JEST the JavaScript Testing Framework to ensure all endpoints are fully functional and return the requested data.
jest-sorted package extends jest.expect with 2 custom matchers, toBeSorted and toBeSortedBy
jest-extended adds additional matchers to Jest's default ones.

Supertest The motivation with this module is to provide a high-level abstraction for testing HTTP, while still allowing you to drop down to the lower-level API provided by superagent.