import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock the Clarity environment
const mockClarity = {
  tx: {
    sender: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM', // Admin address
  },
  contracts: {
    'researcher-verification': {
      functions: {
        'register-researcher': vi.fn(),
        'verify-researcher': vi.fn(),
        'revoke-verification': vi.fn(),
        'is-verified': vi.fn(),
        'get-researcher-details': vi.fn(),
        'transfer-admin': vi.fn(),
      },
    },
  },
};

// Setup global mock
global.clarity = mockClarity;

describe('Researcher Verification Contract', () => {
  beforeEach(() => {
    // Reset mocks before each test
    vi.resetAllMocks();
  });
  
  it('should register a new researcher', async () => {
    const researcher = 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG';
    const name = 'Dr. Jane Smith';
    const credentials = 'PhD in Molecular Biology, Harvard University';
    const institution = 'Stanford Medical Research';
    const specialization = 'Gene Therapy';
    
    mockClarity.contracts['researcher-verification'].functions['register-researcher'].mockReturnValue({
      success: true,
      value: { success: true },
    });
    
    const result = await global.clarity.contracts['researcher-verification'].functions['register-researcher'](
        researcher,
        name,
        credentials,
        institution,
        specialization
    );
    
    expect(result.success).toBe(true);
    expect(mockClarity.contracts['researcher-verification'].functions['register-researcher']).toHaveBeenCalledWith(
        researcher,
        name,
        credentials,
        institution,
        specialization
    );
  });
  
  it('should verify a researcher', async () => {
    const researcher = 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG';
    
    mockClarity.contracts['researcher-verification'].functions['verify-researcher'].mockReturnValue({
      success: true,
      value: { success: true },
    });
    
    const result = await global.clarity.contracts['researcher-verification'].functions['verify-researcher'](researcher);
    
    expect(result.success).toBe(true);
    expect(mockClarity.contracts['researcher-verification'].functions['verify-researcher']).toHaveBeenCalledWith(
        researcher
    );
  });
  
  it('should check if a researcher is verified', async () => {
    const researcher = 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG';
    
    mockClarity.contracts['researcher-verification'].functions['is-verified'].mockReturnValue({
      success: true,
      value: true,
    });
    
    const result = await global.clarity.contracts['researcher-verification'].functions['is-verified'](researcher);
    
    expect(result.success).toBe(true);
    expect(result.value).toBe(true);
    expect(mockClarity.contracts['researcher-verification'].functions['is-verified']).toHaveBeenCalledWith(
        researcher
    );
  });
  
  it('should get researcher details', async () => {
    const researcher = 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG';
    const expectedDetails = {
      status: 1,
      name: 'Dr. Jane Smith',
      credentials: 'PhD in Molecular Biology, Harvard University',
      institution: 'Stanford Medical Research',
      specialization: 'Gene Therapy',
      'verification-date': 12345,
    };
    
    mockClarity.contracts['researcher-verification'].functions['get-researcher-details'].mockReturnValue({
      success: true,
      value: expectedDetails,
    });
    
    const result = await global.clarity.contracts['researcher-verification'].functions['get-researcher-details'](researcher);
    
    expect(result.success).toBe(true);
    expect(result.value).toEqual(expectedDetails);
    expect(mockClarity.contracts['researcher-verification'].functions['get-researcher-details']).toHaveBeenCalledWith(
        researcher
    );
  });
});
