export const mockRouter = {
  replace: jest.fn(),
  push: jest.fn(),
  dismissTo: jest.fn(),
  back: jest.fn(),
  canGoBack: jest.fn(),
};
export const mockParams: { currency?: string } = {};
jest.mock("expo-router", () => ({
  useRouter: () => mockRouter,
  useLocalSearchParams: () => mockParams,
  useIsFocused: () => true,
}));
beforeEach(() => {
  delete mockParams.currency;
  mockRouter.canGoBack.mockReturnValue(true);
});
