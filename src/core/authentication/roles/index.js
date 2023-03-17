class HajarRoles {
  constructor(options) {
    this.jwt = options.jwt;
    this.bcrypt = options.bcrypt;
    this.User = options.User;
    this.Role = options.Role;
    this.Permission = options.Permission; // new
    this.secret = options.secret;
    this.cookieOptions = options.cookieOptions;
  }

  async createRole(roleName, permissions) {
    const existingRole = await this.Role.findOne({ name: roleName });
    if (existingRole) {
      throw new Error(`Role ${roleName} already exists`);
    }

    const role = new this.Role({
      name: roleName,
      permissions,
    });

    await role.save();

    return role;
  }

  async roleToUser(roleId, userId) {
    const user = await this.User.findById(userId);
    if (!user) {
      throw new Error(`User with ID ${userId} not found`);
    }

    const role = await this.Role.findById(roleId);
    if (!role) {
      throw new Error(`Role with ID ${roleId} not found`);
    }

    if (user.roles.includes(roleId)) {
      throw new Error(`User already has role ${role.name}`);
    }

    user.roles.push(roleId);
    await user.save();

    return user;
  }

  async updateRole(roleId, updates) {
    const role = await this.Role.findById(roleId);
    if (!role) {
      throw new Error(`Role with ID ${roleId} not found`);
    }

    if (updates.name) {
      const existingRole = await this.Role.findOne({ name: updates.name });
      if (existingRole && existingRole._id.toString() !== roleId) {
        throw new Error(`Role ${updates.name} already exists`);
      }
      role.name = updates.name;
    }

    if (updates.permissions) {
      role.permissions = updates.permissions;
    }

    await role.save();
    return role;
  }

  async deleteRole(roleId) {
    const role = await this.Role.findById(roleId);
    if (!role) {
      throw new Error(`Role with ID ${roleId} not found`);
    }

    const usersWithRole = await this.User.find({ roles: roleId });
    if (usersWithRole.length > 0) {
      throw new Error(
        `Cannot delete role ${role.name}, ${usersWithRole.length} users have this role.`
      );
    }

    await role.delete();
  }

  async addPermissionToRole(roleId, permission) {
    const role = await this.Role.findById(roleId);
    if (!role) {
      throw new Error(`Role with ID ${roleId} not found`);
    }

    const existingPermission = await this.Permission.findOne({
      grant: permission.grant,
    });
    if (!existingPermission) {
      throw new Error(`Permission ${permission.grant} does not exist`);
    }

    role.permissions.push(existingPermission._id);
    await role.save();

    return role;
  }

  async removePermissionFromRole(roleId, permissionId) {
    const role = await this.Role.findById(roleId);
    if (!role) {
      throw new Error(`Role with ID ${roleId} not found`);
    }

    const index = role.permissions.indexOf(permissionId);
    if (index === -1) {
      throw new Error(`Permission with ID ${permissionId} not found in role`);
    }

    role.permissions.splice(index, 1);
    await role.save();

    return role;
  }

  async updatePermission(permissionId, updates) {
    const permission = await this.Permission.findById(permissionId);
    if (!permission) {
      throw new Error(`Permission with ID ${permissionId} not found`);
    }

    if (updates.grant) {
      const existingPermission = await this.Permission.findOne({
        grant: updates.grant,
      });
      if (
        existingPermission &&
        existingPermission._id.toString() !== permissionId
      ) {
        throw new Error(`Permission ${updates.grant} already exists`);
      }
      permission.grant = updates.grant;
    }

    if (updates.read !== undefined) {
      permission.read = updates.read;
    }

    if (updates.write !== undefined) {
      permission.write = updates.write;
    }

    if (updates.update !== undefined) {
      permission.update = updates.update;
    }

    if (updates.delete !== undefined) {
      permission.delete = updates.delete;
    }

    await permission.save();
    return permission;
  }
}

module.exports = HajarRoles;
