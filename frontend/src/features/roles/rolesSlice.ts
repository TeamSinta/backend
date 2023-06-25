import { RootState } from "@/app/store";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Loading } from "../utils/utilEnum";
import { fetchMembers } from "./rolesAPI";
import { IMember, RolesCreateSlice } from "./rolesInterface";

export const initialState: RolesCreateSlice = {
  title: "",
  members: [
    {
      member_idx: 0,
      member_name: "",
      member_url: "",
      member_type: "",
      selected: false,
    },
  ],
  status: Loading.UNSEND,
};

export const getMemberAsync = createAsyncThunk(
  "roles/fetchMember",
  async () => {
    const response = await fetchMembers();
    const members = response.data.map((memberItem) => ({
      ...memberItem,
      selected: false,
    }));
    return members;
  }
);

//[Where]: How
export const rolesSlice = createSlice({
  name: "roles",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(getMemberAsync.fulfilled, (state, action) => {
      state.members = action.payload;
    });
  },
  reducers: {
    //[CreateDepartment] : GetMembers from backend and showing when you open modal.
    setMembers: (state, actions) => {
      const { members } = actions.payload;
      state.members = members;
    },
    //[CreateDepartment] : When you select member the member selected.
    selectedMember: (state, actions) => {
      const { memberIdx } = actions.payload;
      const selectedMember = state.members.find(
        (member: IMember) => member.member_idx === memberIdx
      );
      if (selectedMember) {
        selectedMember.selected
          ? (selectedMember.selected = false)
          : (selectedMember.selected = true);
      }
    },
    //[CreateDepartment] : onChange for title input, invite member input
    setCreateDepTitleInput: (state, actions) => {
      const { title } = actions.payload;
      state.title = title;
    },
    //[Invite] : Push invited new member after invite member (Depending on the situation there is chance we don't need this logic)
    addInvitedMember: (state, action) => {
      const { invitedMember } = action.payload;
      state.members.push(invitedMember);
    },
    //Will change Thunk
    postData: (state) => {
      const selectedMemberArr = state.members.filter(
        (member: IMember) => member.selected
      );
      state.members = selectedMemberArr;
    },
    roleSliceReset(state) {
      Object.assign(state, initialState);
    },
  },
});

export const {
  setMembers,
  selectedMember,
  postData,
  roleSliceReset,
  setCreateDepTitleInput,
  addInvitedMember,
} = rolesSlice.actions;
export const selectRole = (state: RootState) => state.role;

export default rolesSlice.reducer;
