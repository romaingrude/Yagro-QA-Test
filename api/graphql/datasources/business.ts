import { RESTDataSource } from '@apollo/datasource-rest'
import groupsDB from '../../db/groups.json'

const groups = groupsDB.groups

class BusinessAPI extends RESTDataSource {
  getGroups() {
    return groups
  }

  getGroupById(groupID: number) {
    return groups.find(g => g.id == groupID)
  }
}

export default BusinessAPI
