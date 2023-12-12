import {
  createPassportGitHub,
  PassportGitHubConfig,
} from '../repositories/passportGithub';

describe('createPassportGitHub', () => {
  let passportMock: any;
  let gitHubStrategyMock: any;
  let UserModelMock: any;

  let config: PassportGitHubConfig;

  beforeEach(() => {

    passportMock = {
      use: jest.fn(),
      serializeUser: jest.fn(),
      deserializeUser: jest.fn(),
    };

    gitHubStrategyMock = jest.fn();
    UserModelMock = {
      findOne: jest.fn(),
      create: jest.fn(),
    };

    config = {
      passport: passportMock,
      gitHubStrategy: gitHubStrategyMock,
      UserModel: UserModelMock,
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize GitHub strategy', () => {

    createPassportGitHub(config);

    expect(passportMock.use).toHaveBeenCalled();
  });

  it('should serialize user', () => {
    
    createPassportGitHub(config);

    expect(passportMock.serializeUser).toHaveBeenCalled();
  });

  it('should deserialize user', () => {

    createPassportGitHub(config);

    expect(passportMock.deserializeUser).toHaveBeenCalled();
  });

  it('should handle the case where user is not found', (done) => {
    const req = { user: null };
    const token = 'sampleToken';
    const profile = {
      id: 'sampleId',
      displayName: 'Sample User',
      emails: [{ value: 'user@example.com' }],
    };

    UserModelMock.findOne.mockResolvedValue(null);
    UserModelMock.create.mockResolvedValue(null);

    createPassportGitHub(config);

    // Simulating a request to GitHub strategy
    gitHubStrategyMock.mock.calls[0][1](req, token, null, profile, (error: Error, user: any) => {
      expect(UserModelMock.findOne).toHaveBeenCalledWith({ where: { id: profile.id } });
      expect(UserModelMock.create).toHaveBeenCalledWith({
        id: profile.id,
        token,
        email: profile.emails[0].value,
        displayName: profile.displayName,
      });
      expect(error).toBeNull();
      expect(user).toBeNull();
      done();
    });
  });

  it('should handle the case where user is found', (done) => {
    const req = { user: null };
    const token = 'sampleToken';
    const profile = {
      id: 'sampleId',
      displayName: 'Sample User',
      emails: [{ value: 'user@example.com' }],
    };

    const foundUser = {
      id: profile.id,
      token: null,
      displayName: null,
      email: null,
      save: jest.fn(),
    };

    UserModelMock.findOne.mockResolvedValue(foundUser);
    UserModelMock.create.mockResolvedValue(null);

    createPassportGitHub(config);

    // Simulating a request to GitHub strategy
    gitHubStrategyMock.mock.calls[0][1](req, token, null, profile, (error: Error, user?:any) => {
      expect(UserModelMock.findOne).toHaveBeenCalledWith({ where: { id: profile.id } });
      expect(UserModelMock.create).not.toHaveBeenCalled();
      expect(error).toBeNull();
      expect(user).toEqual(foundUser);
      done();
  })
});
});