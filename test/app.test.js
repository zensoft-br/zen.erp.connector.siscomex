import fs from "fs";
import request from 'supertest';
import { describe, expect, it, vi } from 'vitest';
import app from './src/app.js';

describe('POST /duimp/download', () => {

  it('should return 200 and data when upload and auth succeed', async () => {
    const cert = fs.readFileSync("./tmp/fabianobonin.pfx");

    // 3. Perform the request using Supertest
    const response = await request(app)
      .post('/duimp/download')
      .field('password', '123456')
      .field('duimp', '24BR00000195823')
      .attach('certificate', cert, 'cert.pfx'); // Simulate file upload

    // 4. Assertions
    expect(response.status).toBe(200);
    expect(response.body.duimp.identificacao.numero).toEqual("24BR00000195823");

    // Verify the mocks were actually called
    expect(services.getAuth).toHaveBeenCalledTimes(1);
    expect(services.fetchDuimp).toHaveBeenCalledWith('fake-auth-token', '24BR00000195823');
  });

  // it('should return 400 if certificate is missing', async () => {
  //   const response = await request(app)
  //     .post('/duimp/download')
  //     .field('duimp', '21BR000001'); // No .attach() here

  //   expect(response.status).toBe(400);
  //   expect(response.body.error).toMatch(/Certificate file is required/);

  //   // Ensure we didn't try to auth without a cert
  //   expect(services.getAuth).not.toHaveBeenCalled();
  // });

  // it('should return 500 if authentication fails', async () => {
  //   // Simulate an error from the external service
  //   vi.mocked(services.getAuth).mockRejectedValue(new Error('Invalid Password'));

  //   const fakeCert = Buffer.from('FAKE_CERT_DATA');

  //   const response = await request(app)
  //     .post('/duimp/download')
  //     .field('password', 'wrong')
  //     .field('duimp', '21BR000001')
  //     .attach('certificate', fakeCert, 'cert.pfx');

  //   expect(response.status).toBe(500);
  //   expect(response.body.error).toBe('Failed to authenticate or fetch data');
  // });
});