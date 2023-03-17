class Permissions {
  constructor(options) {
    this.Permission = options.Permission;
  }

  async createPermission(
    grant,
    read = false,
    write = false,
    update = false,
    del = false
  ) {
    const permission = new this.Permission({
      grant,
      read,
      write,
      update,
      delete: del,
    });

    await permission.save();
    return permission;
  }

  async updatePermission(permissionId, updates) {
    const permission = await this.Permission.findById(permissionId);
    if (!permission) {
      throw new Error(`Permission with ID ${permissionId} not found`);
    }

    if (updates.grant) {
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
    if (updates.del !== undefined) {
      permission.delete = updates.del;
    }

    await permission.save();
    return permission;
  }

  async deletePermission(permissionId) {
    const permission = await this.Permission.findById(permissionId);
    if (!permission) {
      throw new Error(`Permission with ID ${permissionId} not found`);
    }

    await permission.delete();
  }

  async getAllPermissions() {
    return await this.Permission.find();
  }
}

module.exports = Permissions;
