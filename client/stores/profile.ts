import { defineStore } from "pinia";

import { BodyT, fetchy } from "@/utils/fetchy";
import { ref } from "vue";

export const useProfileStore = defineStore(
  "profile",
  () => {
    const currAvatar = ref("");
    const currBiography = ref("");

    const getProfile = async (usrn: string) => {
        const results = await fetchy("/api/profiles/"+usrn, "GET", { });
        return results;
    }; 
    const getCurrentProfile = async () => {
        try {
            const { username } = await fetchy("/api/session", "GET", { alert: false });
            const { avatar, biography} = await fetchy("/api/profiles/"+username, "GET", { });
            currAvatar.value = avatar;
            currBiography.value = biography; 
        } catch {
            currAvatar.value = "";
            currBiography.value = ""; 
        }
    };
    const updateProfile = async(patch: BodyT ) => {
        await fetchy("/api/profiles", "PATCH", { body: { update: patch }} );
        getCurrentProfile(); 
    }; 

    return {
        currAvatar,
        currBiography, 
        getProfile,
        getCurrentProfile,
        updateProfile, 
    };
  },
  { persist: true },
);
