export interface UserType {
  token: string;
  user_data: {
    id: number;
    username: string;
    is_staff: boolean;
    profile: {
      id: number;
      name: string;
      representative_full_name?: string; //client
      email: string;
      phone_number: string;
      addresses?: string; //cleint
    };
    user_type: string;
  };
}
